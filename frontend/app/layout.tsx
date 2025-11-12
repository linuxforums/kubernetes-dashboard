import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kubernetes Dashboard',
  description: 'A beautiful dark glassy Kubernetes dashboard for visualizing and managing K8s clusters',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

