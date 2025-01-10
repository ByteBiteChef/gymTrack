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
import { fetchUsers } from "@/services/allServices";
import UserSelectInput from "./UserSelect";
import ActionButton from "./ActionButton";
import { Exercise } from "@/services/types";
import Card from "./DefaultCard";
import NavBar from "./NavBar";

const db = getFirestore(app);

const ExerciseForm = () => {
	//inputs state
	const [exerciseName, setExerciseName] = useState("");
	const [seriesInput, setSeriesInput] = useState("");
	const [weightInput, setWeightInput] = useState("");
	/* eslint-disable @typescript-eslint/no-explicit-any */
	const [exercises, setExercises]: any = useState([]);
	//prefix delimiter
	const PREFIX_DELIMITER = "%%";

	//user state
	const [currentUser, setCurrentUser] = useState("");
	const [users, setUsers] = useState<string[]>([]);
	const [newUser, setNewUser] = useState("");

	//modal state
	const [isOpenShowMore, setIsOpenShowMore] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const handleCloseSelect = () => {
		setIsOpen(false);
		setCurrentUser("");
		setExerciseName("");
	};

	//input handlers
	const handleUserChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const user = e.target.value;
		setCurrentUser(user);
		fetchExercises(user);
	};

	const handleExerciseNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setExerciseName(e.target.value);
		setIsOpen(true); // Show the dropdown when user types
	};

	const handleSeriesChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSeriesInput(e.target.value);
	};

	const handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
		setWeightInput(e.target.value);
	};

	const handleInputClick = (exerciseId: string) => {
		setExerciseName(exerciseId);
		setIsOpen(false);
	};

	//add user and exercise submit handlers
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

	//fetch exercises
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

	//fetch users
	useEffect(() => {
		return fetchUsers(setUsers);
	}, []);

	//fetch exercises on user change
	useEffect(() => {
		if (currentUser) {
			fetchExercises(currentUser);
		}
	}, [currentUser]);

	let selectedExercise = null;
	let recentData = null;
	let mostRecentDate: number | null = null;

	//filter exercises for search bar
	const filteredExercises: Exercise[] = exercises.filter(
		(exercise: Exercise) =>
			exercise.id.toLowerCase().includes(exerciseName.toLowerCase())
	);

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
		<div className="flex flex-col border h-auto rounded-md m-4 p-4 border-orange-400">
			{/* User select input */}
			<UserSelectInput
				currentUser={currentUser}
				users={users}
				handleUserChange={handleUserChange}
				handleCloseSelect={handleCloseSelect}
			/>
			{currentUser ? (
				<></>
			) : (
				<div className="flex mt-4">
					{/* Add user input */}
					<input
						type="text"
						value={newUser}
						onChange={(e) => setNewUser(e.target.value)}
						placeholder="Not in the list?"
						className="border-gray-300 p-1 w-2/3 rounded-sm focus:ring-2 focus:ring-orange-500 focus:outline-none appearance-none"
					/>
					<div className="w-1/3 ml-2">
						<ActionButton
							handleAction={handleAddUser}
							className="p-2 rounded-sm"
							text="Add User"
						/>
					</div>
				</div>
			)}
			{!currentUser ? (
				<></>
			) : (
				<Card>
					<div className="w-full">
						{/* Search input field */}
						<input
							type="text"
							value={exerciseName.replace(currentUser + "%%", "")}
							onChange={handleExerciseNameChange}
							onFocus={() => setIsOpen(true)}
							placeholder="Search for an Exercise"
							className="border rounded-sm w-full p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
						/>

						{/* Exercise list (appears when isOpen = true) */}
						{isOpen && (
							<div className="bg-white border shadow-lg mt-1">
								{filteredExercises.length > 0 ? (
									filteredExercises.map((exercise) => (
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
											)}
										</div>
									))
								) : (
									<p className="p-2 text-gray-500">
										Exercise is not on the list. Add it
									</p>
								)}
							</div>
						)}
					</div>
					{/* Series and Weight input */}
					<div className="w-full items-center my-2">
						<label className="mb-1 font-medium">Series</label>
						<input
							type="text"
							value={seriesInput}
							onChange={handleSeriesChange}
							placeholder="10,12,8"
							className="border p-2 w-full rounded-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
						/>
					</div>
					<div className="w-full items-center mb-2">
						<label className="mb-1 font-medium">Weight</label>
						<input
							type="text"
							value={weightInput}
							onChange={handleWeightChange}
							placeholder="40,45,50"
							className="border p-2 w-full rounded-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
						/>
					</div>
					<ActionButton
						handleAction={handleAddExercise}
						className="p-2 rounded-sm mt-2"
						text="Add Exercise"
					/>
				</Card>
			)}
			{/* Exercise details card*/}
			<div className="mt-2 flex-1">
				{exerciseName &&
				exercises.length > 0 &&
				selectedExercise &&
				recentData ? (
					<Card>
						<h3 className="font-bold text-lg mb-2 text-center">
							{exerciseName.replace(currentUser + "%%", "")}
						</h3>
						<div className="border rounded-sm p-2 w-full">
							<p className="justify-between flex">
								<strong>Last Training: </strong>
								{typeof window !== "undefined" && mostRecentDate
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
						{!isOpenShowMore && (
							<button
								onClick={() => setIsOpenShowMore(true)}
								className="mt-4 border p-2 bg-gray-200 rounded w-full"
							>
								Show more
							</button>
						)}
						{isOpenShowMore && (
							<div className="bg-white shadow-md p-4 rounded border mt-2 w-full">
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

export default ExerciseForm;
