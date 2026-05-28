interface BillingToggleProps {
  annual: boolean;
  onChange: (annual: boolean) => void;
}

export default function BillingToggle(props: BillingToggleProps) {
  return (
    <div class="flex items-center justify-center gap-3">
      <button
        class={`text-sm font-semibold transition-colors ${!props.annual ? "text-white" : "text-slate-500"}`}
        onClick={() => props.onChange(false)}
      >
        Mensual
      </button>

      <button
        class="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none"
        style={props.annual ? "background: #2563EB" : "background: #1E293B"}
        onClick={() => props.onChange(!props.annual)}
        role="switch"
        aria-checked={props.annual}
      >
        <span
          class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
          style={props.annual ? "transform: translateX(24px)" : "transform: translateX(0)"}
        />
      </button>

      <button
        class={`text-sm font-semibold transition-colors ${props.annual ? "text-white" : "text-slate-500"}`}
        onClick={() => props.onChange(true)}
      >
        Anual
        <span class="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
          -17%
        </span>
      </button>
    </div>
  );
}
