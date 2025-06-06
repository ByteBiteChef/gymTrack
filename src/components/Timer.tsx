"use client";
import React, { useState, useEffect, useRef } from "react";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { RiResetLeftFill } from "react-icons/ri";
import { MdOutlineTimer } from "react-icons/md";

const Timer = () => {
	const [initialTime, setInitialTime] = useState(60);
	const [timeLeft, setTimeLeft] = useState(60);
	const [isRunning, setIsRunning] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		setTimeLeft(initialTime);
	}, [initialTime]);

	useEffect(() => {
		if (isRunning) {
			timerRef.current = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						clearInterval(timerRef.current!);
						setIsRunning(false);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [isRunning]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newTime = parseInt(e.target.value, 10);
		setIsRunning(false);
		if (timerRef.current) clearInterval(timerRef.current);
		setInitialTime(newTime);
	};

	const startTimer = () => setIsRunning(true);
	const stopTimer = () => {
		setIsRunning(false);
		if (timerRef.current) clearInterval(timerRef.current);
	};
	const resetTimer = () => {
		setIsRunning(false);
		if (timerRef.current) clearInterval(timerRef.current);
		setTimeLeft(initialTime);
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
			2,
			"0"
		)}`;
	};

	return (
		<>
			{/* Trigger button */}
			<button
				onClick={() => setShowModal(true)}
				className="text-white text-3xl p-1 rounded-full bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left font-bold shadow-[0_0_14px_-7px_#f09819] border-0 active:scale-95"
			>
				<MdOutlineTimer />
			</button>

			{/* Timer Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
					<div className="relative bg-[#1a1a1a] p-6 rounded-xl shadow-lg w-80">
						<button
							onClick={() => setShowModal(false)}
							className="absolute top-2 right-2 text-white text-xl"
						>
							×
						</button>

						<div className="flex flex-col items-center justify-center gap-4">
							{/* Timer content */}
							<div className="relative w-40 h-40 flex items-center justify-center">
								<CircularProgress
									progress={timeLeft / initialTime}
								/>
								<div className="z-10 flex flex-col items-center justify-center gap-2">
									{!isRunning && timeLeft === initialTime ? (
										<div className="text-white">
											<select
												className="bg-[#1a1a1a]"
												value={initialTime}
												onChange={handleChange}
											>
												<option value={30}>
													00:30
												</option>
												<option value={45}>
													00:45
												</option>
												<option value={60}>
													01:00
												</option>
												<option value={90}>
													01:30
												</option>
												<option value={120}>
													02:00
												</option>
											</select>
										</div>
									) : (
										<div className="text-white text-lg">
											{formatTime(timeLeft)}
										</div>
									)}

									<div className="flex gap-2">
										{isRunning ? (
											<button
												className="text-white"
												onClick={stopTimer}
											>
												<CiPause1 />
											</button>
										) : (
											<button
												onClick={startTimer}
												className="text-white"
											>
												<CiPlay1 />
											</button>
										)}
										<button
											className="text-white"
											onClick={resetTimer}
										>
											<RiResetLeftFill />
										</button>
									</div>
								</div>
							</div>
							{/* Optional: Add label or completion message */}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Timer;

// Circular Progress Bar
const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CircularProgress = ({ progress }: { progress: number }) => {
	const strokeDashoffset = (1 - progress) * CIRCUMFERENCE;
	return (
		<svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
			<circle
				cx="50%"
				cy="50%"
				r={RADIUS}
				stroke="#0f0f0f"
				strokeWidth="6"
				fill="transparent"
			/>
			<circle
				cx="50%"
				cy="50%"
				r={RADIUS}
				stroke="#f97316"
				strokeWidth="6"
				fill="transparent"
				strokeDasharray={CIRCUMFERENCE}
				strokeDashoffset={strokeDashoffset}
				style={{ transition: "stroke-dashoffset 1s linear" }}
			/>
		</svg>
	);
};
