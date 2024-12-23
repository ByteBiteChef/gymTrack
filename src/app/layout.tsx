import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import LogoHeader from "@/components/LogoHeader";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Gym Tracker",
	description: "A single-page app to track exercises in the gym.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				{/* Link to the manifest file */}
				<link rel="manifest" href="/manifest.json" />

				{/* PWA meta tags */}
				<meta name="theme-color" content="#ffffff" />
				<meta
					name="description"
					content="A single-page app to track exercises in the gym."
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="apple-touch-icon" href="/exercise-logo.png" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<LogoHeader />
				<Toaster />
				{children}
				<NavBar />
			</body>
		</html>
	);
}
