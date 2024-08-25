import { Inter } from "next/font/google";
import "./globals.css";
import SocketContextProvider from "@/components/Context/IOSocket";
import Analytics from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tiktok Live Monitoring",
  description: "TikTok live monitoring tool to provide unparalleled insights and unparalleled control over live broadcasts. Monitor key performance indicators, manage comments, analyze audience engagement, and make informed adjustments to optimize your live stream's impact. With our intelligent features and powerful analytics, you'll be able to elevate your TikTok presence and captivate your audience like never before",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SocketContextProvider>
          {children}
        </SocketContextProvider>
        <Analytics />
      </body>
    </html>
  );
}
