import { IDailyCalories } from "@/services/types";
import React, { useState } from "react";
interface CaloriesGoalChartProps {
	dailyCalories: IDailyCalories[];
}
const CaloriesGoalChart: React.FC<CaloriesGoalChartProps> = ({
	dailyCalories,
}) => {
	const [caloriesGoal, setCaloriesGoal] = useState(0);
	const [inputValue, setInputValue] = useState("");

	const today = new Date();

	const filteredEntries = dailyCalories.filter(
		(entry) => entry.date === today.toISOString().split("T")[0]
	);

	const totalDayCalories = filteredEntries.reduce(
		(total, entry) => total + entry.amountOfCalories,
		0
	);
	console.log(totalDayCalories);
	console.log(caloriesGoal);

	const progress = (totalDayCalories / caloriesGoal) * 200;
	console.log(progress);
	return (
		<div>
			<div
				className="bg-red-200 h-6 rounded-full m-2 overflow-hidden"
				style={{ width: `200px` }}
			>
				<div
					className="bg-blue-500 h-full transition-all duration-300"
					style={{
						width: `${progress}px`,
					}}
				/>
			</div>
			<div>
				<input
					type="number"
					placeholder="Today's Goal"
					className="w-1/2"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>

				<button
					onClick={() => {
						// parseInt to convert the inputValue (string) to a number
						const numericValue = parseInt(inputValue, 10) || 0;
						setCaloriesGoal(numericValue);
					}}
					className="w-6 h-6 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-full font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
				>
					submit
				</button>

				<p>Current goal: {caloriesGoal}</p>
			</div>
		</div>
	);
};

export default CaloriesGoalChart;
