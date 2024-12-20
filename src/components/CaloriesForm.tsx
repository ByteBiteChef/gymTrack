"use client";

import {
	arrayUnion,
	collection,
	doc,
	onSnapshot,
	setDoc,
} from "firebase/firestore";
import React, { ChangeEvent, useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { toast } from "sonner";
import { fetchDailyCalories, fetchFood } from "../services/allServices";
import { IDailyCalories, IFood } from "@/services/types";

const CaloriesForm = () => {
	//users states
	const [currentUser, setCurrentUser] = useState("");
	const [users, setUsers] = useState<string[]>([]);

	//Food Form
	const [foodName, setFoodName] = useState<string>("");
	const [calories, setCalories] = useState<string>("");

	//Daily Calories Form
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [foodList, setFoodList] = useState<IFood[]>([]);
	const [selectedPortion, setSelectedPortion] = useState<string>("");
	const [dailyCalories, setDailyCalories] = useState<IDailyCalories[]>([]);
	const [selectedFood, setSelectedFood] = useState("");
	const [selectedFoodDetails, setSelectedFoodDetails] =
		useState<IFood | null>(null);
	console.log(dailyCalories);

	//Calories Details Card States
	const [dateForCalories, setDateForCalories] = useState<string>("");

	//Modal States
	const [isFavFoodModalOpen, setIsFavFoodModalOpen] =
		useState<boolean>(false);
	const [isFoodCaloriesModalOpen, setIsFoodCaloriesModalOpen] =
		useState<boolean>(false);
	const [isCaloriesDetailModalOpen, setIsCaloriesDetailModalOpen] =
		useState<boolean>(false);

	//Fetch Daily Calories by currentUser
	useEffect(() => {
		if (currentUser) {
			const fetchData = async () => {
				const data = await fetchDailyCalories(currentUser);
				setDailyCalories(data);
			};

			fetchData();
		}
	}, [currentUser]);

	//Set Selected Food Details (caloriesPer100g renderization)
	useEffect(() => {
		if (selectedFood) {
			const foodDetails = foodList.find(
				(food: IFood) => food.id === selectedFood
			);
			setSelectedFoodDetails(foodDetails || null);
		} else {
			setSelectedFoodDetails(null);
		}
	}, [selectedFood, foodList]);

	//Fetch Users
	useEffect(() => {
		const usersRef = collection(db, "users");
		const unsubscribeUsers = onSnapshot(usersRef, (snapshot) => {
			const userList = snapshot.docs.map((doc) => doc.id);
			setUsers(userList);
		});

		return () => unsubscribeUsers();
	}, []);

	//Fetch Food When CurrentUser Change
	useEffect(() => {
		if (currentUser) {
			const unsubscribe = fetchFood(currentUser, setFoodList);
			return () => unsubscribe && unsubscribe();
		}
	}, [currentUser]);

	//Events Daily Calories Form Handelers
	const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSelectedDate(e.target.value);
	};

	const handlePortionChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSelectedPortion(e.target.value);
	};

	const handleSubmit = async () => {
		if (!currentUser) {
			toast.error("Please select a user.");
			return;
		}

		if (!selectedDate) {
			toast.error("Please select a date.");
			return;
		}

		if (!selectedFood) {
			toast.error("Please select a food.");
			return;
		}

		if (!selectedPortion || isNaN(Number(selectedPortion))) {
			toast.error("Please enter a valid portion.");
			return;
		}

		if (!selectedFoodDetails) {
			toast.error("Selected food details not found.");
			return;
		}

		// Parse portion and calculate calories
		const portion = Number(selectedPortion);
		const caloriesPer100g = selectedFoodDetails.caloriesPer100g;
		const amountOfCalories = (caloriesPer100g * portion) / 100;

		// Generate a unique timestamp for the entry
		const entryTimestamp = Date.now().toString();

		// Derive foodName by removing the user prefix from the food ID
		const foodName = selectedFoodDetails.id.replace(`${currentUser}%%`, "");

		// Reference to the user's document in dailyCalories collection
		const userDocRef = doc(db, "dailyCalories", currentUser);

		try {
			// Update the document with a new food entry under the selected date
			await setDoc(
				userDocRef,
				{
					[selectedDate]: {
						entries: arrayUnion({
							timestamp: entryTimestamp,
							portion,
							foodName,
							amountOfCalories,
						}),
					},
				},
				{ merge: true } // Merge with existing data
			);

			toast.success("Food entry added successfully!");

			// Reset the form
			setSelectedDate("");
			setSelectedFood("");
			setSelectedPortion("");
			setSelectedFoodDetails(null);
			setIsFoodCaloriesModalOpen(false);
		} catch (error) {
			console.error("Error adding food entry:", error);
			toast.error("Failed to add food entry. Please try again.");
		}
	};

	//Calories Details Per Day Handler
	const handleDetailPerDayChange = (e: ChangeEvent<HTMLInputElement>) => {
		setDateForCalories(e.target.value);
	};

	//User Select Handler
	const handleUserChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setCurrentUser(e.target.value);
	};

	//Logic to Post Fav Food
	const handleAddFood = async () => {
		if (!currentUser || !foodName || !calories) {
			toast.error("Please fill all fields!");
			return;
		}

		const documentId = `${currentUser}%%${foodName}`;

		const foodRef = doc(db, "food", documentId);

		try {
			await setDoc(foodRef, {
				caloriesPer100g: Number(calories),
			});

			toast.success("Food added successfully!");
			setCalories("");
			setFoodName("");
			setIsFavFoodModalOpen(false);
		} catch (error) {
			console.error("Error adding food:", error);
			toast.error("Failed to add food.");
		}
	};

	return (
		<div className="flex flex-col border h-auto rounded-md m-4 p-4 border-orange-400">
			{/*Pick User Select*/}
			<div className="p-2">
				<div className="mb-4">
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
				</div>
			</div>
			{/*Add Fav Food Button && Modal*/}
			<div className="flex flex-col items-center">
				{!isFavFoodModalOpen && (
					<button
						onClick={() => {
							setIsFavFoodModalOpen(true);
						}}
						className="w-full mt-4 p-1 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
					>
						Add favorite food
					</button>
				)}
				{isFavFoodModalOpen && (
					<div className="relative w-full shadow flex-1 items-center flex flex-col p-2 bg-white m-2">
						<button
							onClick={() => {
								setIsFavFoodModalOpen(false);
							}}
							className="absolute right-2 px-2 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-sm font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
						>
							X
						</button>

						<div className="w-full items-center m-2">
							<label className="block mb-1 font-medium">
								Food Name
							</label>
							<input
								type="text"
								value={foodName}
								onChange={(e) => setFoodName(e.target.value)}
								placeholder="Food name"
								className="border p-1 w-full"
							/>
						</div>
						<div className="w-full items-center m-2">
							<label className="block mb-1 font-medium">
								Calories
							</label>
							<input
								type="number"
								value={calories}
								onChange={(e) => setCalories(e.target.value)}
								placeholder="Calories/100g"
								className="border p-1 w-full"
							/>
						</div>
						<div>
							<button
								onClick={handleAddFood}
								className="ml-4 p-2 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
							>
								Add Food
							</button>
						</div>
					</div>
				)}
			</div>
			{/*Add Calories Food Button && Modal*/}
			{!isFoodCaloriesModalOpen && (
				<button
					onClick={() => {
						setIsFoodCaloriesModalOpen(true);
					}}
					className="w-full mt-4 p-1 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
				>
					add food calories
				</button>
			)}
			{isFoodCaloriesModalOpen && (
				<div className="relative w-full shadow flex-1 items-center flex flex-col p-2 bg-white mt-4">
					<button
						onClick={() => {
							setIsFoodCaloriesModalOpen(false);
						}}
						className="absolute right-2 px-2 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-sm font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
					>
						X
					</button>
					<div>
						<label className="text-white">Pick a date </label>
						<input
							id="datePicker"
							type="date"
							value={selectedDate}
							onChange={handleDateChange}
						/>
					</div>
					<div className="mb-4">
						<select
							value={selectedFood}
							onChange={(e) => setSelectedFood(e.target.value)}
							className="border border-gray-300 bg-white text-gray-800 p-1 w-full rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
						>
							<option value="" disabled>
								Pick a food
							</option>
							{foodList.map((food: IFood) => (
								<option key={food.id} value={food.id}>
									{food.id.replace(currentUser + "%%", "")}
								</option>
							))}
						</select>
					</div>
					<div className="border border-2">
						<p>
							{selectedFoodDetails
								? `${selectedFoodDetails.caloriesPer100g} kcal/100g`
								: ""}
						</p>
					</div>
					<div>
						<label>Portion</label>
						<input
							type="number"
							value={selectedPortion}
							onChange={handlePortionChange}
							className="p-2"
							placeholder="Portion/gr"
						/>
					</div>
					<div>
						<button
							onClick={handleSubmit}
							className="ml-4 p-2 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
						>
							submit
						</button>
					</div>
				</div>
			)}
			{/*Show More Details Button && Modal*/}
			{!isCaloriesDetailModalOpen && (
				<button
					onClick={() => {
						setIsCaloriesDetailModalOpen(true);
					}}
					className="w-full mt-4 p-1 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
				>
					Show calories per days
				</button>
			)}
			{isCaloriesDetailModalOpen && (
				<div className="bg-white mt-4 flex items-center justify-center flex-col">
					<label className="text-black">Pick a date </label>
					<input
						id="datePicker2"
						type="date"
						value={dateForCalories}
						onChange={handleDetailPerDayChange}
					/>
				</div>
			)}
		</div>
	);
};

export default CaloriesForm;
