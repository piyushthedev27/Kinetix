import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import "./styles/tokens.css";
import "./styles/landing.css";
import "./styles/pages.css";

export const metadata: Metadata = {
  title: "Kinetix - Physics You Can See",
  description: "Turn a real throw into a physics lesson.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
