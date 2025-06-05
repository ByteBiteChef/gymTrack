"use client";

import ExerciseForm from "@/components/ExerciseForm";
import Timer from "@/components/Timer";

const Home = () => {
	const timer = process.env.NEXT_PUBLIC_TIMER;
	return (
		<div className="flex flex-col h-screen w-screen bg-[#0a0a0a] overflow-scroll pb-28">
			<ExerciseForm />
			{timer === "true" && (
				<div>
					<Timer />
				</div>
			)}
		</div>
	);
};

export default Home;
