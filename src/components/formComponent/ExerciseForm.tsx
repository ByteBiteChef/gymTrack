"use client";
import React, { useState } from "react";
import { doc, setDoc, getFirestore, collection } from "firebase/firestore";
import { app } from "../../../firebase/firebase";

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

		await setDoc(exerciseDocRef, {
			createdAt: new Date(),
		});
		setInputValue("");
		setIsOpen(false);
	};

	return (
		<div className="bg-blue-500 h-full m-8">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="border w-36 m-2"
			>
				Pick an Exercise
			</button>

			{isOpen && (
				<div className="ml-2 bg-white border shadow-lg w-36">
					<div className="flex">
						<input
							type="text"
							value={inputValue}
							onChange={handleInputChange}
							placeholder="Add an Exercise"
							className="border p-2 w-full"
						/>
						<button onClick={handleAddExercise} className="border">
							Add
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ExerciseForm;
