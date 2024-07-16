import { Inter } from "next/font/google";
import Header from "./header";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
          <Header/>
            <main className="flex-1 rounded">{children}</main>
        </div>
      </body>
    </html>
  );
}
