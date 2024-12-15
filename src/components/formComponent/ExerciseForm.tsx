"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
	doc,
	setDoc,
	getFirestore,
	collection,
	arrayUnion,
	onSnapshot,
	serverTimestamp,
} from "firebase/firestore";
import { app } from "../../../firebase/firebase";
import { toast } from "sonner";
import { fetchUsers } from "@/services/exerciseService";
import { BRAND_BACKGROUND_COLOR } from "@/styles/constants";

const db = getFirestore(app);

const ExerciseForm = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [exerciseName, setExerciseName] = useState("");
	const [seriesInput, setSeriesInput] = useState("");
	const [weightInput, setWeightInput] = useState("");
	/* eslint-disable @typescript-eslint/no-explicit-any */
	const [exercises, setExercises]: any = useState([]);
	const [currentUser, setCurrentUser] = useState("");
	const [users, setUsers] = useState<string[]>([]);
	const [newUser, setNewUser] = useState("");

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

	const handleUserChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const user = e.target.value;
		setCurrentUser(user);
		fetchExercises(user);
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

		if (seriesArray.length === 0) {
			toast.error("You must provide valid series values.");
			return;
		}

		if (
			seriesArray.length !== weightArray.length &&
			weightArray.length > 0
		) {
			toast.error(
				"Either leave the weight field empty, or ensure the number of series and weights match."
			);
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
		if (!user) return;
		const exercisesRef = collection(db, "exercises");
		const unsubscribe = onSnapshot(exercisesRef, (snapshot) => {
			const updatedExercises = snapshot.docs
				.map((doc) => ({ id: doc.id, ...doc.data() }))
				/* eslint-disable @typescript-eslint/no-explicit-any */
				.filter((exercise: any) => exercise.user === user);
			setExercises(updatedExercises);
		});
		return () => unsubscribe();
	};

	const handleAddUser = async () => {
		const trimmedUser = newUser.trim();
		if (!trimmedUser) {
			toast.error("User name cannot be empty.");
			return;
		}

		try {
			// Create a doc in 'users' collection with the user's name as the doc ID
			await setDoc(doc(db, "users", trimmedUser), {
				createdAt: serverTimestamp(),
			});
			toast.success("User added successfully!");
			setNewUser("");
		} catch (error) {
			console.error(error);
			toast.error("Failed to add user.");
		}
	};

	useEffect(() => {
		return fetchUsers(setUsers);
	}, []);

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
			<div className="mb-4 flex">
				<input
					type="text"
					value={newUser}
					onChange={(e) => setNewUser(e.target.value)}
					placeholder="Add new user"
					className="border p-1 w-full"
				/>
				<button
					onClick={handleAddUser}
					className={`${BRAND_BACKGROUND_COLOR}"w-1/3 ml-2 border px-2`}
				>
					Add User
				</button>
			</div>
			<div className="mb-4">
				<select
					value={currentUser}
					onChange={handleUserChange}
					className="border p-2 w-full"
				>
					<option value="" disabled>
						Who&apos;s there?
					</option>
					{users.map((user) => (
						<option key={user} value={user}>
							{user}
						</option>
					))}
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
				<div className="items-center mb-2 mt-2">
					<label className="block mb-1 font-medium">Series</label>
					<input
						type="text"
						value={seriesInput}
						onChange={handleSeriesChange}
						placeholder="10,12,8"
						className="border p-2 w-full"
					/>
				</div>
				<div className="items-center mb-2">
					<label className="block mb-1 font-medium">Weight</label>
					<input
						type="text"
						value={weightInput}
						onChange={handleWeightChange}
						placeholder="40,45,50"
						className="border p-2 w-full"
					/>
				</div>
				<button
					onClick={handleAddExercise}
					className={`${BRAND_BACKGROUND_COLOR} border p-2 w-3/6`}
				>
					Add Exercise
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
