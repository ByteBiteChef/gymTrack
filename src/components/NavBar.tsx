"use client";

import React, { FC } from "react";
import Link from "next/link";
import { CgGym } from "react-icons/cg";
import { MdOutlineQueryStats, MdFastfood } from "react-icons/md";
import { usePathname } from "next/navigation";
import Image from "next/image";
import empa from "../../public/empa.png";

interface NavBarProp {
	user?: string;
}

const NavBar: FC<NavBarProp> = ({ user }) => {
	const pathname = usePathname();

	const isActive = (path: string) => pathname === path;

	if (typeof user === "undefined") {
		console.log("User is undefined; not rendering NavBar.");
		return null;
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 h-20 bg-gray-950 border-t-2 border-orange-500 overflow-visible">
			<div className="flex items-center justify-around h-full w-full relative">
				{user === "Max" && (
					<div>
						<Link href="/empanadas-calculator">
							<Image
								alt={"icon-empa"}
								src={empa}
								width={40}
								height={50}
							/>
						</Link>
					</div>
				)}
				<div
					className={`${
						isActive("/")
							? "text-orange-500 text-4xl"
							: "text-white text-2xl"
					}`}
				>
					<Link href="/">
						<CgGym />
					</Link>
				</div>
				<div
					className={`${
						isActive("/progress")
							? "text-orange-500 text-4xl"
							: "text-white text-2xl"
					}`}
				>
					<Link href="/progress">
						<MdOutlineQueryStats />
					</Link>
				</div>
				<div
					className={`${
						isActive("/calories-tracker")
							? "text-orange-500 text-4xl"
							: "text-white text-2xl"
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
