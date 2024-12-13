"use client";
import React, { useState } from "react";
import { doc, setDoc, getFirestore, collection } from "firebase/firestore";
import { app } from "../../../firebase/firebase";
import ExerciseCard from "../card/ExerciseCard";

const db = getFirestore(app);

const ExerciseForm = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [inputValue, setInputValue] = useState("");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleAddExercise = async (): Promise<void> => {
		const exerciseName = inputValue.trim();
		if (!exerciseName) return;

		const exerciseDocRef = doc(collection(db, "exercises"), exerciseName);

		const timestampFieldName = Date.now().toString();

		await setDoc(
			exerciseDocRef,
			{
				[timestampFieldName]: {
					series: [10, 12, 8],
				},
			},
			{ merge: true }
		);

		setInputValue("");
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
					<div className="bg-white border shadow-lg w-36">
						<div className="flex">
							<input
								type="text"
								value={inputValue}
								onChange={handleInputChange}
								placeholder="Add an Exercise"
								className="border p-2 w-full"
							/>
							<button
								onClick={handleAddExercise}
								className="border"
							>
								Add
							</button>
						</div>
					</div>
				)}
			</div>
			<div className="m-8 flex-1">
				<ExerciseCard />
			</div>
		</div>
	);
};

export default ExerciseForm;
