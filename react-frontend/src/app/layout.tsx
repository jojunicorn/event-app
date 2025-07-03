import type { Metadata } from "next";
import "./globals.css";
import GlobalLayout from "./GlobalLayout";

export const metadata: Metadata = {
  title: "EventSphere",
  description: "Eventmanagement app to demonstrate the usage of a UI Development framework",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GlobalLayout>{children}</GlobalLayout>
      </body>
    </html>
  );
}
