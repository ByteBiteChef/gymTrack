"use client";
import React, { useEffect, useState } from "react";
import {
	doc,
	setDoc,
	getFirestore,
	collection,
	arrayUnion,
	getDocs,
} from "firebase/firestore";
import { app } from "../../../firebase/firebase";

const db = getFirestore(app);

const ExerciseForm = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [exerciseName, setExerciseName] = useState("");
	const [seriesInput, setSeriesInput] = useState("");
	const [weightInput, setWeightInput] = useState("");
	/* eslint-disable @typescript-eslint/no-explicit-any */
	const [exercises, setExercises]: any = useState([]);

	const handleExerciseNameChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setExerciseName(e.target.value);
	};

	const handleInputClick = (exerciseId: string) => {
		setExerciseName(exerciseId);
		setIsOpen(false);
	};

	const handleSeriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSeriesInput(e.target.value);
	};

	const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setWeightInput(e.target.value);
	};

	const handleAddExercise = async (): Promise<void> => {
		const trimmedName = exerciseName.trim();
		if (!trimmedName) return;

		const seriesArray = seriesInput
			.split(",")
			.map((value) => parseInt(value.trim(), 10))
			.filter((num) => !isNaN(num));

		const weightArray = weightInput
			.split(",")
			.map((value) => parseInt(value.trim(), 10))
			.filter((num) => !isNaN(num));

		if (seriesArray.length === 0 || weightArray.length === 0) {
			console.error("You must provide valid series and weight values.");
			return;
		}

		if (seriesArray.length !== weightArray.length) {
			console.error("The number of series and weights must match.");
			return;
		}

		const exerciseDocRef = doc(collection(db, "exercises"), trimmedName);
		const timestampFieldName = Date.now();

		await setDoc(
			exerciseDocRef,
			{
				dates: arrayUnion(timestampFieldName),
			},
			{ merge: true }
		);

		await setDoc(
			exerciseDocRef,
			{
				[timestampFieldName]: {
					series: seriesArray,
					weight: weightArray,
				},
			},
			{ merge: true }
		);

		setExerciseName("");
		setSeriesInput("");
		setWeightInput("");
		setIsOpen(false);
	};

	const fetchExercises = async () => {
		try {
			const querySnapshot = await getDocs(collection(db, "exercises"));
			const exercisesData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setExercises(exercisesData);
		} catch (error) {
			console.error("Error fetching exercises:", error);
		}
	};

	useEffect(() => {
		fetchExercises();
	}, []);

	let selectedExercise = null;
	let recentData = null;
	let mostRecentDate: number | null = null;

	if (exerciseName && exercises.length > 0) {
		/* eslint-disable @typescript-eslint/no-explicit-any */
		selectedExercise = exercises.find((ex: any) => ex.id === exerciseName);

		if (
			selectedExercise &&
			selectedExercise.dates &&
			selectedExercise.dates.length > 0
		) {
			mostRecentDate = Math.max(...selectedExercise.dates);
			recentData = selectedExercise[mostRecentDate];
		}
	}

	return (
		<div className="flex flex-col bg-blue-500 h-full m-8">
			<div className="bg-red-300 m-8 flex-1">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="border w-36"
				>
					{exerciseName || "Pick an Exercise"}{" "}
				</button>
				{isOpen && (
					<div className="bg-white shadow-lg w-64">
						<div className="mb-2">
							<input
								type="text"
								value={exerciseName}
								onChange={handleExerciseNameChange}
								placeholder="Add Exercise Name"
								className="border p-2 w-full"
							/>
						</div>
						<div className="exercise-list">
							{exercises.length > 0 ? (
								/* eslint-disable @typescript-eslint/no-explicit-any */
								exercises.map((exercise: any) => (
									<div
										key={exercise.id}
										className="p-2 hover:bg-gray-100 cursor-pointer border-b"
										onClick={() =>
											handleInputClick(exercise.id)
										}
									>
										{exercise.id}
									</div>
								))
							) : (
								<p className="p-2 text-gray-500">
									No exercises added yet
								</p>
							)}
						</div>
					</div>
				)}
				<div className="mb-2 mt-2">
					<input
						type="text"
						value={seriesInput}
						onChange={handleSeriesChange}
						placeholder="Add Series (e.g. 10,12,8)"
						className="border p-2 w-full"
					/>
				</div>
				<div className="mb-2">
					<input
						type="text"
						value={weightInput}
						onChange={handleWeightChange}
						placeholder="Weights (e.g. 40,45,50)"
						className="border p-2 w-full"
					/>
				</div>
				<button
					onClick={handleAddExercise}
					className="border p-2 w-full"
				>
					Add
				</button>
			</div>
			<div className="m-8 flex-1">
				{exerciseName &&
				exercises.length > 0 &&
				selectedExercise &&
				mostRecentDate &&
				recentData ? (
					<div className="bg-white p-4 mt-4 rounded shadow">
						<h3 className="font-bold text-lg mb-2">
							{exerciseName}
						</h3>
						<p>Date: {new Date(mostRecentDate).toLocaleString()}</p>
						<p>
							Series:{" "}
							{Array.isArray(recentData.series)
								? recentData.series.join(", ")
								: ""}
						</p>
						<p>
							Weight:{" "}
							{Array.isArray(recentData.weight)
								? recentData.weight.join(", ")
								: ""}
						</p>
					</div>
				) : (
					exerciseName && (
						<p className="text-white">
							No data found for the selected exercise.
						</p>
					)
				)}
			</div>
		</div>
	);
};

export default ExerciseForm;
