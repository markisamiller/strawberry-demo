import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Strawberry Harvesting Pipeline — Mark Miller",
  description:
    "An interactive demo of a deep learning pipeline for robotic strawberry harvesting: YOLOv11 detection, U-Net peduncle segmentation, and PCA stem-angle extraction.",
  openGraph: {
    title: "Strawberry Harvesting Pipeline",
    description: "Deep learning perception pipeline for robotic strawberry harvesting.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
