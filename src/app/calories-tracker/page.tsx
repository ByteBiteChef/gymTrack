import React from "react";
import Image from "next/image";
import CaloriesForm from "@/components/CaloriesForm";

const CaloriesTracker = () => {
	return (
		<div className="flex flex-col h-screen w-screen bg-[#0a0a0a] overflow-scroll pb-28 item">
			<div className="flex justify-center py-4 mt-6">
				<Image
					src="/calories-tracker.png"
					alt="App Logo"
					width={350}
					height={100}
				/>
			</div>

			<CaloriesForm />
		</div>
	);
};

export default CaloriesTracker;
