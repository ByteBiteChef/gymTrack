"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "../../firebase/firebase";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import Card from "./DefaultCard";
import NavBar from "./NavBar";

const db = getFirestore(app);

const Progress = () => {
	const [currentUser, setCurrentUser] = useState("");

	/* eslint-disable @typescript-eslint/no-explicit-any */
	const [exercises, setExercises] = useState<any[]>([]);
	const [exerciseName, setExerciseName] = useState("");

	useEffect(() => {
		const savedUser = localStorage.getItem("selectedUser");
		if (savedUser) {
			setCurrentUser(savedUser);
		} else {
			console.warn("No user found in localStorage.");
		}
	}, []);

	useEffect(() => {
		// Fetch exercises for the current user
		if (!currentUser) return;

		const exercisesRef = collection(db, "exercises");
		const unsubscribeExercises = onSnapshot(exercisesRef, (snapshot) => {
			const allExercises = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			// Filter by current user
			const userExercises = allExercises.filter(
				/* eslint-disable @typescript-eslint/no-explicit-any */
				(exercise: any) => exercise.user === currentUser
			);
			setExercises(userExercises);
		});

		return () => unsubscribeExercises();
	}, [currentUser]);

	const handleExerciseChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setExerciseName(e.target.value);
	};
	/* eslint-disable @typescript-eslint/no-explicit-any */
	let selectedExercise: any = null;
	let recentData = null;
	let mostRecentDate: number | null = null;
	let chartData: { date: string; avgSeries: number; avgWeight: number }[] =
		[];

	if (exerciseName && exercises.length > 0) {
		/* eslint-disable @typescript-eslint/no-explicit-any */
		selectedExercise = exercises.find((ex: any) => ex.id === exerciseName);

		if (
			selectedExercise &&
			selectedExercise.dates &&
			selectedExercise.dates.length > 0
		) {
			// Find the most recent date
			mostRecentDate = Math.max(...selectedExercise.dates);
			recentData = selectedExercise[mostRecentDate];

			// Construct data for chart
			chartData = selectedExercise.dates
				.filter((d: number) => selectedExercise[d]) // ensure data exists for this date
				.map((date: number) => {
					const dataForDate = selectedExercise[date];
					const avgSeries =
						dataForDate.series.reduce(
							(a: number, b: number) => a + b,
							0
						) / dataForDate.series.length;
					const avgWeight =
						dataForDate.weight.reduce(
							(a: number, b: number) => a + b,
							0
						) / dataForDate.weight.length;

					return {
						date: new Date(date).toLocaleDateString("en-GB", {
							weekday: "short",
							day: "numeric",
							month: "short",
						}),
						avgSeries,
						avgWeight,
					};
				})
				/* eslint-disable @typescript-eslint/no-explicit-any */
				.sort((a: any, b: any) =>
					new Date(a.date).getTime() > new Date(b.date).getTime()
						? 1
						: -1
				);
		}
	}

	return (
		<div className="flex flex-col border h-auto rounded-md m-4 p-4 border-orange-400 text-white">
			{!currentUser ? (
				<p className="text-white">Loading user...</p>
			) : null}

			{currentUser && exercises.length > 0 && (
				<div>
					<select
						value={exerciseName}
						onChange={handleExerciseChange}
						className="border border-gray-300 bg-white text-gray-800 p-1 w-full rounded-sm appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
					>
						<option value="" disabled>
							Pick an Exercise
						</option>
						{/* eslint-disable @typescript-eslint/no-explicit-any  */}
						{exercises.map((ex: any) => (
							<option key={ex.id} value={ex.id}>
								{ex.id.replace(currentUser + "%%", "")}
							</option>
						))}
					</select>
				</div>
			)}

			<div className="flex-1">
				{exerciseName && selectedExercise && recentData ? (
					<Card className="text-black">
						<Card className="shadow p-2 border">
							<h3 className="font-bold text-lg mb-2 text-black">
								{exerciseName.replace(currentUser + "%%", "")}
							</h3>
							<div className="w-full border rounded-sm p-2">
								<p className="justify-between flex">
									<strong>Last Training: </strong>
									{typeof window !== "undefined" &&
									mostRecentDate
										? new Date(
												mostRecentDate
										  ).toLocaleDateString("en-GB", {
												weekday: "short",
												day: "numeric",
												month: "short",
										  })
										: "Loading..."}
								</p>
								<p className="justify-between flex">
									<strong>Series: </strong>
									{Array.isArray(recentData.series)
										? recentData.series.join(", ")
										: ""}
								</p>
								<p className="justify-between flex">
									<strong>Weight: </strong>
									{Array.isArray(recentData.weight)
										? recentData.weight.join(", ")
										: ""}
								</p>
							</div>
						</Card>
						{/* Render the chart if we have multiple data points */}
						{chartData && chartData.length > 0 && (
							<div className="w-full mt-6 border rounded-sm p-2 shadow">
								<h4 className="font-bold text-md mb-2">
									Progress Over Time
								</h4>
								<ResponsiveContainer width="100%" height={300}>
									<LineChart data={chartData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="date" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Line
											type="monotone"
											dataKey="avgSeries"
											stroke="#8884d8"
											name="Avg Series"
										/>
										<Line
											type="monotone"
											dataKey="avgWeight"
											stroke="#82ca9d"
											name="Avg Weight"
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						)}
					</Card>
				) : (
					exerciseName && (
						<p className="text-white">
							No data found for the selected exercise.
						</p>
					)
				)}
			</div>
			<NavBar user={currentUser} />
		</div>
	);
};

export default Progress;
