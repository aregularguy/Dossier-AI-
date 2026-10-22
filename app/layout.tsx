import type { Metadata } from "next";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dropzone/styles.css";
import "./globals.css";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Resume Reviewer AI",
  description: "Get AI-powered feedback on your resume in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <Providers>
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
