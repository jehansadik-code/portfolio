import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jehan Sadik | Software Engineer",
  description: "Portfolio of Jehan Sadik, a full-stack developer and computer science undergraduate.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
