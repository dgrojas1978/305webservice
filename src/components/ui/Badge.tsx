import { JSX } from "solid-js";

type BadgeVariant = "blue" | "emerald" | "purple" | "orange" | "gray" | "cyan";

interface BadgeProps {
  variant?: BadgeVariant;
  class?: string;
  children: JSX.Element;
}

const variantClasses: Record<BadgeVariant, string> = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  gray: "bg-white/5 text-slate-400 border-white/10",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

export default function Badge(props: BadgeProps) {
  return (
    <span
      class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        variantClasses[props.variant ?? "blue"]
      } ${props.class ?? ""}`}
    >
      {props.children}
    </span>
  );
}
