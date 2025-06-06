"use client";

import ExerciseForm from "@/components/ExerciseForm";
import Timer from "@/components/Timer";
import WorkoutTimer from "@/components/WorkoutTimer";

const Home = () => {
	return (
		<div className="flex flex-col h-screen w-screen bg-[#0a0a0a] overflow-scroll pb-28">
			<div className="flex mt-4 px-4 justify-between">
				<WorkoutTimer />
				<Timer />
			</div>

			<ExerciseForm />
		</div>
	);
};

export default Home;
