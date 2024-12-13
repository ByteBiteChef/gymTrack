"use client";
import React, { useState } from "react";
import {
	doc,
	setDoc,
	getFirestore,
	collection,
	updateDoc,
	arrayUnion,
} from "firebase/firestore";
import { app } from "../../../firebase/firebase";
import ExerciseCard from "../card/ExerciseCard";

const db = getFirestore(app);

const ExerciseForm = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [exerciseName, setExerciseName] = useState("");
	const [seriesInput, setSeriesInput] = useState("");
	const [weightInput, setWeightInput] = useState("");

	const handleExerciseNameChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setExerciseName(e.target.value);
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
		const timestampFieldName = Date.now().toString();

		await updateDoc(exerciseDocRef, {
			dates: arrayUnion(timestampFieldName),
		}).catch(async (error) => {
			if (error.code === "not-found") {
				await setDoc(exerciseDocRef, {
					dates: [timestampFieldName],
				});
			} else {
				throw error;
			}
		});

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

	return (
		<div className="flex bg-blue-500 h-full m-8">
			<div className="bg-red-300 m-8 flex-1">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="border w-36"
				>
					Pick an Exercise
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
					</div>
				)}
				<div className="mb-2">
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
				<ExerciseCard />
			</div>
		</div>
	);
};

export default ExerciseForm;
