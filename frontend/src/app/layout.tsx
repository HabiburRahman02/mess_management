"use client";

import Navbar from "@/components/common/Navbar";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <main className="p-6">{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
