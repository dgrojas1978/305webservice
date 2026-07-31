import { onCleanup, onMount } from "solid-js";
import "leaflet/dist/leaflet.css";
import type { MapPoint } from "~/lib/dashboard";

/**
 * Mapa de toques del panel.
 *
 * Un círculo es una CIUDAD, nunca una persona. Las coordenadas salen de la
 * misma búsqueda por IP que da el nombre de la ciudad, así que su precisión es
 * la de la ciudad: un pin por toque fingiría saber dónde estaba alguien.
 * El tamaño del círculo dice cuántos toques, no cuánta certeza.
 *
 * Todo ocurre en `onMount`: Leaflet toca `window` y `document` nada más
 * arrancar, así que en el render del servidor reventaría.
 */
export default function TapMap(props: { points: MapPoint[] }) {
  let el: HTMLDivElement | undefined;
  let destroy: (() => void) | undefined;

  onMount(async () => {
    if (!el) return;
    const L = await import("leaflet");

    const map = L.map(el, {
      // La rueda haría zoom sin querer al bajar por el panel.
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      // Atribución obligatoria por la licencia de OpenStreetMap.
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const max = Math.max(1, ...props.points.map((p) => p.n));
    // `circleMarker` a propósito: el marcador por defecto de Leaflet carga su
    // icono desde una ruta relativa que el empaquetador rompe, y saldría un
    // hueco. Un círculo no depende de ningún archivo.
    const marks = props.points.map((p) =>
      L.circleMarker([p.lat, p.lon], {
        radius: 8 + Math.round((p.n / max) * 16),
        color: "#20d7c5",
        weight: 2,
        fillColor: "#20d7c5",
        fillOpacity: 0.35,
      })
        .bindPopup(
          `<strong>${[p.city, p.region, p.country].filter(Boolean).join(", ")}</strong><br>` +
          `${p.n} ${p.n === 1 ? "toque" : "toques"}<br>` +
          `<em>ubicación aproximada</em>`,
        )
        .addTo(map),
    );

    if (marks.length) {
      map.fitBounds(L.featureGroup(marks).getBounds().pad(0.4), { maxZoom: 11 });
    } else {
      map.setView([25.7743, -80.1937], 9); // Miami
    }

    destroy = () => map.remove();
  });

  // Sin esto, volver al panel dejaría un mapa muerto agarrado al nodo anterior.
  onCleanup(() => destroy?.());

  return <div ref={el} class="h-80 w-full overflow-hidden rounded-lg bg-[rgba(247,249,252,0.06)]" />;
}
