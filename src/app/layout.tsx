import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Greenfield International College | School & Student Result Portal",
    template: "%s | Greenfield International College",
  },
  description: "Official portal for Greenfield International College. Check student academic results, access admissions information, and manage academic records.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
