import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/archivo/wdth.css";
import "./globals.css";
import { NotFoundView } from "@/components/not-found-view";

export const metadata: Metadata = {
  title: "404 · Quang Nga Motorbikes Rental",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">
        <NotFoundView />
      </body>
    </html>
  );
}
