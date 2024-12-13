"use client";
import React, { useState } from "react";

const ExerciseForm = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [inputValue, setInputValue] = useState("");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
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
					<input
						type="text"
						value={inputValue}
						onChange={handleInputChange}
						placeholder="Add an Exercise"
						className="border p-2 w-full"
					/>
				</div>
			)}
		</div>
	);
};

export default ExerciseForm;
