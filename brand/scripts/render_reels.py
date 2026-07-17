"""Render de reels a MP4 — captura determinista frame a frame vía CDP.

Por cada reels/reel-0N.html:
  1. Edge headless con --remote-debugging-port
  2. Emulation.setDeviceMetricsOverride 1080×1920
  3. Espera document.fonts.ready
  4. Por frame (30 fps): Runtime.evaluate seek(t) + Page.captureScreenshot
  5. ffmpeg → H.264 yuv420p +faststart (sin audio: no hay narración grabada)
  6. Verificación: duración/fps/codec, decodificación completa, QR del frame final
"""
import base64
import json
import shutil
import subprocess
import tempfile
import time
import urllib.request
from pathlib import Path

import cv2
import websocket

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
FFMPEG = shutil.which("ffmpeg") or r"C:\Users\danyg\AppData\Local\Microsoft\WinGet\Links\ffmpeg.exe"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "out" / "reels"
OUT.mkdir(parents=True, exist_ok=True)
PORT = 9377
FPS = 30
URL = "https://305webservice.com"

REELS = [("reel-01", 16000), ("reel-02", 17000), ("reel-03", 17000)]


class CDP:
    def __init__(self, ws_url: str):
        self.ws = websocket.create_connection(ws_url, timeout=180)
        self.mid = 0

    def cmd(self, method: str, params: dict | None = None) -> dict:
        self.mid += 1
        self.ws.send(json.dumps({"id": self.mid, "method": method, "params": params or {}}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.mid:
                if "error" in msg:
                    raise RuntimeError(f"{method}: {msg['error']}")
                return msg.get("result", {})

    def evaluate(self, expr: str, await_promise: bool = False):
        r = self.cmd("Runtime.evaluate", {"expression": expr, "awaitPromise": await_promise,
                                          "returnByValue": True})
        return r.get("result", {}).get("value")


def launch_edge(profile: Path) -> subprocess.Popen:
    proc = subprocess.Popen(
        [EDGE, "--headless", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
         f"--remote-debugging-port={PORT}", "--remote-allow-origins=*",
         f"--user-data-dir={profile}",
         "--window-size=1080,1920", "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(60):
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json") as r:
                tabs = json.loads(r.read())
            page = next(t for t in tabs if t["type"] == "page")
            return proc, page["webSocketDebuggerUrl"]
        except Exception:
            time.sleep(0.5)
    raise RuntimeError("Edge CDP no respondió")


def render_reel(cdp: CDP, name: str, total_ms: int) -> Path:
    html = (ROOT / "reels" / f"{name}.html").as_uri()
    cdp.cmd("Page.enable")
    cdp.cmd("Emulation.setDeviceMetricsOverride",
            {"width": 1080, "height": 1920, "deviceScaleFactor": 1, "mobile": False})
    cdp.cmd("Page.navigate", {"url": html})
    time.sleep(1.5)
    cdp.evaluate("document.fonts.ready.then(() => true)", await_promise=True)
    assert cdp.evaluate("typeof window.seek === 'function'"), f"{name}: seek() no existe"

    frames = total_ms * FPS // 1000
    tmp = Path(tempfile.mkdtemp(prefix=f"{name}-"))
    t_start = time.time()
    for i in range(frames):
        t = round(i * 1000 / FPS, 3)
        cdp.evaluate(f"window.seek({t})")
        shot = cdp.cmd("Page.captureScreenshot", {"format": "png"})
        (tmp / f"f{i:04d}.png").write_bytes(base64.b64decode(shot["data"]))
    print(f"  {name}: {frames} frames capturados en {time.time() - t_start:.0f}s")

    mp4 = OUT / f"{name}.mp4"
    subprocess.run(
        [FFMPEG, "-y", "-framerate", str(FPS), "-i", str(tmp / "f%04d.png"),
         "-c:v", "libx264", "-preset", "slow", "-crf", "17",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(mp4)],
        check=True, capture_output=True)
    shutil.rmtree(tmp, ignore_errors=True)
    return mp4


def verify(mp4: Path, expected_s: float) -> None:
    # metadatos
    info = subprocess.run([FFMPEG, "-i", str(mp4)], capture_output=True, text=True).stderr
    assert "h264" in info and "yuv420p" in info and "30 fps" in info, info
    assert "1080x1920" in info, info
    # decodificación completa sin errores
    dec = subprocess.run([FFMPEG, "-v", "error", "-i", str(mp4), "-f", "null", "-"],
                         capture_output=True, text=True)
    assert dec.returncode == 0 and not dec.stderr.strip(), dec.stderr
    # duración
    import re
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", info)
    dur = int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])
    assert abs(dur - expected_s) < 0.2, f"duración {dur}s != {expected_s}s"
    # QR del frame final (CTA estático)
    tmp_png = mp4.with_suffix(".lastframe.png")
    subprocess.run([FFMPEG, "-y", "-sseof", "-0.5", "-i", str(mp4), "-frames:v", "1",
                    str(tmp_png)], check=True, capture_output=True)
    img = cv2.imread(str(tmp_png))
    data, _, _ = cv2.QRCodeDetector().detectAndDecode(img)
    if not data:
        h, w = img.shape[:2]
        data, _, _ = cv2.QRCodeDetector().detectAndDecode(img[h // 3: 4 * h // 5, :])
    tmp_png.unlink(missing_ok=True)
    assert data == URL, f"QR frame final = {data!r}"
    print(f"  {mp4.name}: {dur:.2f}s · 1080x1920 · 30fps · h264 · QR OK")


def render_one(name: str, total: int) -> None:
    """Navegador fresco por reel; un reintento ante fallo transitorio."""
    for attempt in (1, 2):
        profile = Path(tempfile.mkdtemp(prefix="edge-cdp-"))
        proc, ws_url = launch_edge(profile)
        try:
            cdp = CDP(ws_url)
            mp4 = render_reel(cdp, name, total)
            verify(mp4, total / 1000)
            return
        except Exception as e:
            print(f"  {name}: intento {attempt} falló ({type(e).__name__}: {e})")
            if attempt == 2:
                raise
        finally:
            proc.terminate()
            shutil.rmtree(profile, ignore_errors=True)


if __name__ == "__main__":
    import sys
    wanted = sys.argv[1:] or [n for n, _ in REELS]
    for name, total in REELS:
        if name in wanted:
            render_one(name, total)
    print("\nReels completos.")
