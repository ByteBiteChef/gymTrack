import { IDailyCalories } from "@/services/types";
import React, { useState } from "react";
import { MdEdit } from "react-icons/md";

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

	const progress = (totalDayCalories / caloriesGoal) * 300;

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="mt-4">
				{!caloriesGoal ? (
					<div className="flex items-center justify-center gap-1">
						<input
							type="number"
							placeholder="Today's Goal"
							className="w-2/3 rounded-md rounded-sm appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
						/>
						<button
							onClick={() => {
								const numericValue =
									parseInt(inputValue, 10) || 0;
								setCaloriesGoal(numericValue);
							}}
							className="w-6 h-6 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-sm font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
						>
							+
						</button>
					</div>
				) : (
					<div className="flex items-center justify-center gap-4">
						<p className="text-orange-500 font-bold">
							Today&apos;s Goal: {caloriesGoal}kcal
						</p>
						<button
							onClick={() => {
								setCaloriesGoal(0);
							}}
							className="w-6 h-6 text-lg flex items-center justify-center uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-full font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
						>
							<MdEdit />
						</button>
					</div>
				)}
			</div>
			{caloriesGoal ? (
				<div
					className="h-3 bg-gray-900 h-6 rounded-full m-2 overflow-hidden border border-gray-400"
					style={{ width: `300px` }}
				>
					<div
						className="rounded-full h-full transition-all duration-300 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left shadow-lg"
						style={{
							width: `${progress}px`,
						}}
					/>
				</div>
			) : null}
		</div>
	);
};

export default CaloriesGoalChart;
