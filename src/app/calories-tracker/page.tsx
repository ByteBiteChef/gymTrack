import React from "react";
import Image from "next/image";
import CaloriesForm from "@/components/CaloriesForm";

const CaloriesTracker = () => {
	return (
		<div className="flex flex-col h-screen w-screen bg-[#0a0a0a] overflow-scroll pb-28 item">
			<CaloriesForm />
		</div>
	);
};

export default CaloriesTracker;
