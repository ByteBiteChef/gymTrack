"use client";
import React, { useEffect, useState, useRef } from "react";
import { IoIosTimer } from "react-icons/io";

const formatTime = (totalSeconds: number): string => {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return [
		hours.toString().padStart(2, "0"),
		minutes.toString().padStart(2, "0"),
		seconds.toString().padStart(2, "0"),
	].join(":");
};

const WorkoutTimer = () => {
	const [seconds, setSeconds] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (isRunning) {
			intervalRef.current = setInterval(() => {
				setSeconds((prev) => prev + 1);
			}, 1000);
		} else if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isRunning]);

	const handleStartPause = () => {
		setIsRunning((prev) => !prev);
	};

	const handleReset = () => {
		setIsRunning(false);
		setSeconds(0);
	};

	return (
		<>
			{/* Compact top bar display */}
			<div className="flex items-center gap-2 text-white">
				<button
					onClick={() => setShowModal(true)}
					className="text-3xl p-1 rounded-full bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left font-bold shadow-[0_0_14px_-7px_#f09819] border-0 active:scale-95"
				>
					<IoIosTimer />
				</button>
				<div className="text-sm font-mono">{formatTime(seconds)}</div>
			</div>

			{/* Timer Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
					<div className="relative bg-[#1a1a1a] p-6 rounded-xl shadow-lg w-80 text-white">
						<button
							onClick={() => setShowModal(false)}
							className="absolute top-2 right-2 text-white text-xl"
						>
							×
						</button>
						<h2 className="text-lg font-bold mb-4 text-center">
							Workout Timer
						</h2>
						<div className="text-center text-4xl font-mono mb-4">
							{formatTime(seconds)}
						</div>
						<div className="flex justify-center gap-4">
							<button
								onClick={handleStartPause}
								className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 transition"
							>
								{isRunning ? "Pause" : "Start"}
							</button>
							<button
								onClick={handleReset}
								className="px-4 py-2 rounded bg-gray-300 text-black hover:bg-gray-400 transition"
							>
								Reset
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default WorkoutTimer;
