"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
	doc,
	setDoc,
	getFirestore,
	collection,
	arrayUnion,
	onSnapshot,
	query,
	where,
} from "firebase/firestore";
import { app } from "../../../firebase/firebase";
import { toast } from "sonner";

const db = getFirestore(app);

const ExerciseForm = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [exerciseName, setExerciseName] = useState("");
	const [seriesInput, setSeriesInput] = useState("");
	const [weightInput, setWeightInput] = useState("");
	/* eslint-disable @typescript-eslint/no-explicit-any */
	const [exercises, setExercises]: any = useState([]);
	const [currentUser, setCurrentUser] = useState("");

	useEffect(() => {
		// Attach a listener to the exercises collection
		const unsubscribe = onSnapshot(
			collection(db, "exercises"),
			(snapshot) => {
				const updatedExercises = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setExercises(updatedExercises);
			}
		);

		// Cleanup listener on component unmount
		return () => unsubscribe();
	}, []);

	const handleUserChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCurrentUser(e.target.value); // Update the current user
		fetchExercises(e.target.value); // Fetch exercises for the entered user
	};

	const handleExerciseNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setExerciseName(e.target.value);
	};

	const handleInputClick = (exerciseId: string) => {
		setExerciseName(exerciseId);
		setIsOpen(false);
	};

	const handleSeriesChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSeriesInput(e.target.value);
	};

	const handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
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
			toast.error("You must provide valid series and weight values.");
			return;
		}

		if (seriesArray.length !== weightArray.length) {
			toast.error("The number of series and weights must match.");
			return;
		}

		const exerciseDocRef = doc(collection(db, "exercises"), trimmedName);
		const timestampFieldName = Date.now();

		await setDoc(
			exerciseDocRef,
			{
				dates: arrayUnion(timestampFieldName),
				user: currentUser,
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
		toast.success("Exercise added successfully!");
		setExerciseName("");
		setSeriesInput("");
		setWeightInput("");
		setIsOpen(false);
	};

	const fetchExercises = (user: string) => {
		const exercisesQuery = query(
			collection(db, "exercises"),
			where("user", "==", user)
		);

		const unsubscribe = onSnapshot(exercisesQuery, (snapshot) => {
			const updatedExercises = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setExercises(updatedExercises);
		});

		return () => unsubscribe();
	};

	useEffect(() => {
		if (currentUser) {
			fetchExercises(currentUser);
		}
	}, [currentUser]);

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
		<div className="flex flex-col border h-auto rounded-md m-8 p-4">
			<div className="mb-4">
				<select
					value={currentUser}
					onChange={(e) =>
						handleUserChange(
							e as unknown as ChangeEvent<HTMLInputElement>
						)
					}
					className="border p-2 w-full"
				>
					<option value="" disabled>
						Who&apos;s there?
					</option>
					<option value="nuny">nuny</option>
					<option value="max">max</option>
				</select>
			</div>
			<div className="shadow flex-1 items-center flex flex-col p-4">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="border w-36 "
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
					className="border p-2 w-3/6 bg-green-200"
				>
					Add
				</button>
			</div>
			<div className="mt-8 flex-1">
				{exerciseName &&
				exercises.length > 0 &&
				selectedExercise &&
				recentData ? (
					<div className="bg-white p-4 rounded shadow">
						<h3 className="font-bold text-lg mb-2">
							{exerciseName}
						</h3>
						<p className="border p-2 justify-between flex">
							<strong>Last Training: </strong>
							{typeof window !== "undefined" && mostRecentDate
								? new Date(mostRecentDate).toLocaleDateString(
										"en-GB",
										{
											weekday: "short",
											day: "numeric",
											month: "short",
										}
								  )
								: "Loading..."}
						</p>
						<p className="border p-2 justify-between flex">
							<strong>Series: </strong>
							{Array.isArray(recentData.series)
								? recentData.series.join(", ")
								: ""}
						</p>
						<p className="border p-2 justify-between flex">
							<strong>Weight: </strong>
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
