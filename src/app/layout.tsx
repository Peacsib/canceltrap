import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["500", "600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CancelTrap — AI Subscription Defuser & Trial Kill-Switch",
  description:
    "Expose sneaky dark-pattern cancellation mazes, calculate 5-year vampire bleed, and disarm auto-renewals before you get charged.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans antialiased text-[#0f1e3b]">
        {children}
      </body>
    </html>
  );
}
