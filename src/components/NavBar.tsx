"use client";

import Link from "next/link";
import React from "react";
import { CgGym } from "react-icons/cg";
import { MdOutlineQueryStats } from "react-icons/md";
import { MdFastfood } from "react-icons/md";
import { usePathname } from "next/navigation";

const NavBar = () => {
	const pathname = usePathname();

	const isActive = (path: string) => pathname === path;

	return (
		<div className="fixed bottom-0 left-0 right-0 h-20 bg-gray-950 border-t-2 border-orange-500 overflow-visible">
			<div className="flex items-center justify-around h-full w-full relative">
				<div
					className={`text-3xl ${
						isActive("/")
							? "text-orange-500 text-5xl"
							: "text-white text-3xl"
					}`}
				>
					<Link href="/">
						<CgGym />
					</Link>
				</div>

				<div
					className={` ${
						isActive("/progress")
							? "text-orange-500 text-5xl"
							: "text-white text-3xl"
					}`}
				>
					<Link href="/progress">
						<MdOutlineQueryStats />
					</Link>
				</div>

				<div
					className={`text-3xl ${
						isActive("/calories-tracker")
							? "text-orange-500 text-5xl"
							: "text-white text-3xl"
					}`}
				>
					<Link href="/calories-tracker">
						<MdFastfood />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NavBar;
