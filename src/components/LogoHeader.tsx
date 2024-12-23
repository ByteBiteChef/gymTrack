"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import React from "react";

const LogoHeader = () => {
	const pathname = usePathname();

	return (
		<div className="flex flex-col items-center justify-center bg-[#0a0a0a]">
			{pathname === "/progress" && (
				<div className="flex justify-center py-4 mt-6">
					<Image
						src="/gym-stats.png"
						alt="Gym Stats Logo"
						width={200}
						height={100}
					/>
				</div>
			)}

			{pathname === "/" && (
				<div className="flex justify-center py-4 mt-6">
					<Image
						src="/gym-tracker.png"
						alt="Gym Tracker Logo"
						width={250}
						height={200}
					/>
				</div>
			)}

			{pathname === "/calories-tracker" && (
				<div className="flex justify-center py-4 mt-6">
					<Image
						src="/calories-tracker.png"
						alt="Calories Tracker Logo"
						width={350}
						height={100}
					/>
				</div>
			)}
		</div>
	);
};

export default LogoHeader;
