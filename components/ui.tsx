import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type ButtonProps = { href: string; children: ReactNode; variant?: "primary" | "secondary" | "ghost"; small?: boolean };
export function Button({ href, children, variant = "primary", small = false }: ButtonProps) { return <Link className={`button ${variant}${small ? " small" : ""}`} href={href}>{children}{variant === "primary" && <ArrowRight size={16} aria-hidden="true" />}</Link>; }
export function Brand() { return <Link className="brand" href="/"><Image src="/logo.svg" alt="" width={23} height={20} priority /><span>Kinetix</span></Link>; }
export function MetricStrip({ metrics }: { metrics: { label: string; value: string }[] }) { return <div className="metric-strip">{metrics.map((metric) => <div className="metric" key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>; }
export function MotionIcon() { return <div className="motion-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M6 39C16 8 30 7 43 29"/><circle cx="28" cy="12" r="3" fill="var(--lime)" /></svg></div>; }
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) { return <p className={`eyebrow ${className}`.trim()}>{children}</p>; }
export function SectionHeading({ eyebrow, title, description }: { eyebrow: ReactNode; title: ReactNode; description?: ReactNode }) { return <header className="section-head"><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div>{description ? <p>{description}</p> : null}</header>; }
export function StatusPill({ children, tone = "live" }: { children: ReactNode; tone?: "live" | "muted" | "info" | "warning" }) { const toneClass = tone === "muted" ? "" : tone; return <span className={`tag ${toneClass}`.trim()}>{tone === "live" ? <i aria-hidden="true" /> : null}{children}</span>; }
export function LoadingMark({ label = "Loading" }: { label?: string }) { return <div className="loading-mark" role="status"><Image className="loading-mark__logo" src="/logo-loader.svg" alt="" width={32} height={28} /><span>{label}</span></div>; }
