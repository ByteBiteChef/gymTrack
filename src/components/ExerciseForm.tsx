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
	query,
	where,
	getDoc,
} from "firebase/firestore";
import { app } from "../../firebase/firebase";
import { toast } from "sonner";
import { fetchUsers } from "@/services/exerciseService";

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
	const PREFIX_DELIMITER = "%%";
	const [isOpenShowMore, setIsOpenShowMore] = useState(false);

	const handleUserChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const user = e.target.value;
		setCurrentUser(user);
		fetchExercises(user);
	};

	const handleCloseSelect = () => {
		setIsOpen(false);
		setCurrentUser("");
		setExerciseName("");
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
		if (!trimmedName) {
			toast.error("Exercise name cannot be empty.");
			return;
		}

		if (!currentUser) {
			toast.error("Please select a user.");
			return;
		}

		const prefixedExerciseName = trimmedName.startsWith(
			currentUser + PREFIX_DELIMITER
		)
			? trimmedName
			: currentUser + PREFIX_DELIMITER + trimmedName;

		const seriesArray = seriesInput
			.split(",")
			.map((num) => Number(num.trim()))
			.filter((num) => !isNaN(num));

		if (seriesArray.length === 0) {
			toast.error("Please provide valid series values.");
			return;
		}

		const weightArray = weightInput.trim()
			? weightInput
					.split(",")
					.map((num) => Number(num.trim()))
					.filter((num) => !isNaN(num))
			: Array(seriesArray.length).fill(0);

		if (weightInput.trim() && weightArray.length !== seriesArray.length) {
			toast.error("Ensure the number of series and weights match.");
			return;
		}

		const exerciseDocRef = doc(
			collection(db, "exercises"),
			prefixedExerciseName
		);
		const timestamp = Date.now();

		try {
			await setDoc(
				exerciseDocRef,
				{
					dates: arrayUnion(timestamp),
					user: currentUser,
					[timestamp]: { series: seriesArray, weight: weightArray },
				},
				{ merge: true }
			);

			toast.success("Exercise added successfully!");
			setExerciseName("");
			setSeriesInput("");
			setWeightInput("");
			setIsOpen(false);
		} catch (error) {
			console.error("Error adding exercise:", error);
			toast.error("Failed to add exercise. Please try again.");
		}
	};

	const fetchExercises = (user: string) => {
		if (!user) return;

		const exercisesRef = collection(db, "exercises");

		const q = query(
			exercisesRef,
			where("__name__", ">=", user + "%%"),
			where("__name__", "<", user + "%%\uffff")
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const updatedExercises = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
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

		const userDocRef = doc(db, "users", trimmedUser);
		const userDocSnapshot = await getDoc(userDocRef);

		try {
			if (userDocSnapshot.exists()) {
				toast.error(
					"User name already exists. Please choose a different name."
				);
				return;
			}
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
				<select
					value={currentUser}
					onChange={handleUserChange}
					className="border border-gray-300 bg-white text-gray-800 p-1 w-full rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
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
				<button
					onClick={handleCloseSelect}
					className="w-auto ml-2 px-2 text-center text-xs uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
				>
					x
				</button>
			</div>
			{currentUser ? (
				<></>
			) : (
				<div className="mb-4 flex">
					<input
						type="text"
						value={newUser}
						onChange={(e) => setNewUser(e.target.value)}
						placeholder="Not in the list?"
						className="border-gray-300 p-1 w-2/3 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none appearance-none"
					/>
					<button
						onClick={handleAddUser}
						className="w-1/3 ml-4 p-1 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
					>
						Add User
					</button>
				</div>
			)}
			{!currentUser ? (
				<></>
			) : (
				<div className="shadow flex-1 items-center flex flex-col p-4 bg-white">
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="border w-36 "
					>
						{exerciseName.replace(currentUser + "%%", "") ||
							"Pick an Exercise"}{" "}
					</button>
					{isOpen && (
						<div className="bg-white shadow-lg w-64">
							<div className="mb-2">
								<input
									type="text"
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
											{exercise.id.replace(
												currentUser + "%%",
												""
											)}{" "}
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
						className="ml-4 p-2 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
					>
						Add Exercise
					</button>
				</div>
			)}
			<div className="mt-2 flex-1">
				{exerciseName &&
				exercises.length > 0 &&
				selectedExercise &&
				recentData ? (
					<div className="bg-white p-2 shodow border">
						<div className="bg-white shadow p-2 rounded border">
							<h3 className="font-bold text-lg mb-2">
								{exerciseName.replace(currentUser + "%%", "")}
							</h3>
							<div className="border rounded-md p-2">
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
						</div>
						{!isOpenShowMore && (
							<button
								onClick={() => setIsOpenShowMore(true)}
								className="mt-4 border p-2 bg-gray-200 rounded w-full"
							>
								Show more
							</button>
						)}
						{isOpenShowMore && (
							<div className="bg-white shadow-md p-4 rounded border mt-2">
								<h2 className="font-bold text-lg mb-2">
									Exercise List
								</h2>
								{selectedExercise &&
								selectedExercise.dates &&
								selectedExercise.dates.length > 0 ? (
									<div className="flex flex-col gap-2">
										{selectedExercise.dates.map(
											(date: any) => {
												const seriesData =
													selectedExercise[date]
														?.series || [];
												const weightData =
													selectedExercise[date]
														?.weight || [];
												return (
													<div
														key={date}
														className="border p-2 rounded"
													>
														<p className="text-sm text-gray-600">
															{new Date(
																date
															).toLocaleDateString(
																"en-GB",
																{
																	weekday:
																		"short",
																	day: "numeric",
																	month: "short",
																}
															)}
														</p>
														<p className="flex justify-between">
															<strong>
																Series:
															</strong>
															{seriesData.length >
															0
																? seriesData.join(
																		", "
																  )
																: "N/A"}
														</p>
														<p className="flex justify-between">
															<strong>
																Weight:
															</strong>
															{weightData.length >
															0
																? weightData.join(
																		", "
																  )
																: "N/A"}
														</p>
													</div>
												);
											}
										)}
									</div>
								) : (
									<p className="text-gray-500">
										No data available for this exercise.
									</p>
								)}
								<button
									onClick={() => setIsOpenShowMore(false)}
									className="mt-4 border p-2 bg-gray-200 rounded w-full"
								>
									Close
								</button>
							</div>
						)}
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
