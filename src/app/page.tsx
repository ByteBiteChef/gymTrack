"use client";

import { useState } from "react";
import ExerciseForm from "@/components/ExerciseForm";
import Timer from "@/components/Timer";
import { MdOutlineTimer } from "react-icons/md";

const Home = () => {
	const [showTimerModal, setShowTimerModal] = useState(false);

	return (
		<div className="flex flex-col h-screen w-screen bg-[#0a0a0a] overflow-scroll pb-28">
			<div className="flex items-center justify-end mt-4 px-4">
				<button
					onClick={() => setShowTimerModal(true)}
					className="text-white text-3xl p-1 rounded-full bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left font-bold shadow-[0_0_14px_-7px_#f09819] border-0 active:scale-95"
				>
					<MdOutlineTimer />
				</button>
			</div>

			{showTimerModal && (
				<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
					<div className="relative bg-[#1a1a1a] p-6 rounded-xl shadow-lg w-80">
						<button
							onClick={() => setShowTimerModal(false)}
							className="absolute top-2 right-2 text-white text-xl"
						>
							×
						</button>
						<div className="flex flex-col items-center">
							<Timer />
						</div>
					</div>
				</div>
			)}

			<ExerciseForm />
		</div>
	);
};

export default Home;
