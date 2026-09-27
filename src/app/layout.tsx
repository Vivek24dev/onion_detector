import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { RoleProvider } from "@/lib/role-context";
import { DemoRoleSwitcher } from "@/components/ui/demo-role-switcher";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Onion Quality Assessment",
  description: "AI-based Onion Quality Assessment and Grading System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col text-slate-900`}>
        <RoleProvider>
          <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2 text-green-700 font-bold text-xl">
                <Leaf className="w-6 h-6" />
                <span>AgriQ</span>
              </Link>
              <div className="hidden md:block mx-4">
                <DemoRoleSwitcher />
              </div>
              <nav className="flex gap-6 items-center">
                <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Dashboard</Link>
                <Link href="/history" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">History</Link>
                <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Logout</Link>
              </nav>
            </div>
            {/* Mobile switcher */}
            <div className="md:hidden border-t px-4 py-2 bg-slate-50 flex justify-center">
              <DemoRoleSwitcher />
            </div>
          </header>
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </RoleProvider>
      </body>
    </html>
  );
}
