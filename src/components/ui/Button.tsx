import { JSX, splitProps } from "solid-js";
import { A } from "@solidjs/router";

type Variant = "primary" | "secondary" | "ghost" | "emerald" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand-blue hover:bg-blue-500 text-white shadow-sm hover:shadow-blue-500/25 hover:shadow-lg",
  secondary: "bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20",
  ghost: "text-slate-300 hover:text-white hover:bg-white/5",
  emerald: "bg-brand-emerald hover:bg-emerald-500 text-white shadow-sm hover:shadow-emerald-500/25 hover:shadow-lg",
  outline: "border border-brand-blue text-brand-accent hover:bg-brand-blue hover:text-white",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

export default function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, [
    "variant",
    "size",
    "href",
    "external",
    "fullWidth",
    "loading",
    "class",
    "children",
  ]);

  const classes = () =>
    [
      "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer select-none",
      "hover:-translate-y-0.5 active:translate-y-0",
      variantClasses[local.variant ?? "primary"],
      sizeClasses[local.size ?? "md"],
      local.fullWidth ? "w-full" : "",
      local.loading ? "opacity-70 pointer-events-none" : "",
      local.class ?? "",
    ]
      .filter(Boolean)
      .join(" ");

  if (local.href) {
    if (local.external) {
      return (
        <a href={local.href} class={classes()} target="_blank" rel="noopener noreferrer">
          {local.children}
        </a>
      );
    }
    return (
      <A href={local.href} class={classes()}>
        {local.children}
      </A>
    );
  }

  return (
    <button class={classes()} {...rest}>
      {local.loading ? (
        <>
          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Procesando...
        </>
      ) : (
        local.children
      )}
    </button>
  );
}
