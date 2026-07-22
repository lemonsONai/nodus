import type { SVGProps } from "react";

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function IconHome(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}
export function IconCalendar(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
      <rect x={4} y={5.5} width={16} height={15} rx={3} />
      <path d="M8 3.5v4M16 3.5v4M4.5 10.5h15" />
    </svg>
  );
}
export function IconGrid(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
      <rect x={4} y={4} width={7} height={7} rx={1.5} />
      <rect x={13} y={4} width={7} height={7} rx={1.5} />
      <rect x={4} y={13} width={7} height={7} rx={1.5} />
      <rect x={13} y={13} width={7} height={7} rx={1.5} />
    </svg>
  );
}
export function IconManage(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
      <path d="M4 6h16M4 12h16M4 18h10" />
      <circle cx={19} cy={18} r={1.4} fill="currentColor" stroke="none" />
    </svg>
  );
}
export function IconSettings(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
      <path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h13M21 17h0" />
      <circle cx={13} cy={7} r={2.1} />
      <circle cx={7} cy={12} r={2.1} />
      <circle cx={17} cy={17} r={2.1} />
    </svg>
  );
}
export function IconClose(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
export function IconBarbell(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...p}>
      <path d="M2.5 12h2M5 9.5v5M8 8v8M18 9.5v5M21.5 12h-2M16 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}
export function IconYoga(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...p}>
      <circle cx={12} cy={4.2} r={1.9} />
      <path d="M4.5 18c1.5-3.2 4-5.4 7.5-5.4s6 2.2 7.5 5.4" />
      <path d="M7 14.2c-1 1.6-1.8 2.6-3.3 2.9M17 14.2c1 1.6 1.8 2.6 3.3 2.9" />
    </svg>
  );
}
export function IconEdit(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 20h4l11-11a2.1 2.1 0 0 0-4-4L4 16v4Z" />
      <path d="M13.5 6.5l4 4" />
    </svg>
  );
}
export function IconChevronLeft(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}
export function IconChevronRight(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
export function IconPlus(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
