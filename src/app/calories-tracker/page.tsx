import React from "react";
import Image from "next/image";

const CaloriesTracker = () => {
	return (
		<div className="flex flex-col h-screen w-screen bg-[#0a0a0a] overflow-scroll">
			<div className="bg-[#0a0a0a] justify-center items-center flex border-b border-gray-950 ">
				<Image
					src="/calories-tracker-logo.png"
					className="mt-8"
					alt="App Logo"
					width={250}
					height={200}
				/>
			</div>
		</div>
	);
};

export default CaloriesTracker;
