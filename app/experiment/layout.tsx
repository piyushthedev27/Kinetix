import { AuthGuard } from "@/components/AuthGuard";

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
