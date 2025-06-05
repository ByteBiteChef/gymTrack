import React, { useState, useEffect, useRef } from "react";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { RiResetLeftFill } from "react-icons/ri";

const Timer = () => {
	const [initialTime, setInitialTime] = useState(60);
	const [timeLeft, setTimeLeft] = useState(60);
	const [isRunning, setIsRunning] = useState(false);
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

	const startTimer = () => {
		if (!isRunning) setIsRunning(true);
	};

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
		<div className="relative w-40 h-40 flex items-center justify-center m-2">
			<CircularProgress progress={timeLeft / initialTime} />

			<div className="z-10 flex flex-col items-center justify-center gap-2">
				{!isRunning && timeLeft === initialTime ? (
					<div className="text-white">
						<select
							className="bg-gray-950"
							value={initialTime}
							onChange={handleChange}
						>
							<option value={30}>00:30</option>
							<option value={45}>00:45</option>
							<option value={60}>01:00</option>
							<option value={90}>01:30</option>
							<option value={120}>02:00</option>
						</select>
					</div>
				) : (
					<div className="text-white text-lg">
						{formatTime(timeLeft)}
					</div>
				)}

				<div className="flex gap-2">
					{isRunning ? (
						<button className="text-white" onClick={stopTimer}>
							<CiPause1 />
						</button>
					) : (
						<button onClick={startTimer} className="text-white">
							<CiPlay1 />
						</button>
					)}
					<button className="text-white" onClick={resetTimer}>
						<RiResetLeftFill />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Timer;

const RADIUS = 70;
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
				strokeWidth="8"
				fill="transparent"
			/>
			<circle
				cx="50%"
				cy="50%"
				r={RADIUS}
				stroke="#f97316"
				strokeWidth="8"
				fill="transparent"
				strokeDasharray={CIRCUMFERENCE}
				strokeDashoffset={strokeDashoffset}
				style={{ transition: "stroke-dashoffset 1s linear" }}
			/>
		</svg>
	);
};
