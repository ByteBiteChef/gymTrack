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
		<div className="w-40 h-40 flex m-2">
			<div className="flex flex-col border-orange-400 border rounded-full w-full h-full p-2 items-center justify-center gap-2">
				{!isRunning && timeLeft === initialTime ? (
					<div className="text-white">
						<label>
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
						</label>
					</div>
				) : (
					<div className="text-white">{formatTime(timeLeft)}</div>
				)}

				<div className="flex gap-2">
					{isRunning ? (
						<button
							className="rounded-sm w-fit text-white"
							onClick={stopTimer}
						>
							<CiPause1 />
						</button>
					) : (
						<div className="w-auto">
							<button
								onClick={startTimer}
								className="rounded-sm w-fit text-white"
							>
								<CiPlay1 />
							</button>
						</div>
					)}

					<button
						className="rounded-sm w-fit text-white"
						onClick={resetTimer}
					>
						<RiResetLeftFill />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Timer;
