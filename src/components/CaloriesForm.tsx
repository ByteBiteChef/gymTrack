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
import UserSelectInput from "./UserSelect";
import CaloriesGoalChart from "./CaloriesGoalChart";

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

	//Calories Details Card States
	const [dateForCalories, setDateForCalories] = useState<string>("");

	//Modal States
	const [isNewFoodModalOpen, setIsNewFoodModalOpen] =
		useState<boolean>(false);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
	const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

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

	//filter food by date
	const filteredEntries = dailyCalories.filter(
		(entry) => entry.date === dateForCalories
	);
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
			setAddModalOpen(false);
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

	//Logic to Post New Food
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
			setIsNewFoodModalOpen(false);
		} catch (error) {
			console.error("Error adding food:", error);
			toast.error("Failed to add food.");
		}
	};

	//Logic to get total calories
	const totalDayCalories = filteredEntries.reduce(
		(total, entry) => total + entry.amountOfCalories,
		0
	);

	// Format the date for total calories render
	const date = new Date(dateForCalories);

	const formattedDate = `${date.getDate()} ${date.toLocaleString("es-ES", {
		month: "short",
	})}`;

	const handleCloseSelect = () => {
		setCurrentUser("");
		setFoodList([]);
	};

	const handleModalAdd = () => {
		setAddModalOpen((prevState) => !prevState);
	};

	return (
		<div className="flex flex-col border h-auto rounded-md m-4 p-4 border-orange-400">
			{/*Pick User Select*/}
			<UserSelectInput
				currentUser={currentUser}
				users={users}
				handleUserChange={handleUserChange}
				handleCloseSelect={handleCloseSelect}
			/>
			{/*Calories goal*/}
			<CaloriesGoalChart
				dailyCalories={dailyCalories}
				currentUser={currentUser}
			/>
			{/*Add New Food Button && Modal*/}
			<div className="flex flex-col items-center">
				{!isNewFoodModalOpen && (
					<button
						onClick={() => {
							setIsNewFoodModalOpen(true);
						}}
						className="w-auto mt-4 p-1 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
					>
						Add new food
					</button>
				)}
				{isNewFoodModalOpen && (
					<div className="relative w-full shadow flex-1 items-center flex flex-col p-2 bg-white m-2">
						<button
							onClick={() => {
								setIsNewFoodModalOpen(false);
							}}
							className="absolute right-2 px-2 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-sm font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
						>
							X
						</button>
						<div className="flex">
							<div className="w-full items-center m-2">
								<label className="block mb-1 font-medium">
									Food Name
								</label>
								<input
									type="text"
									value={foodName}
									onChange={(e) =>
										setFoodName(e.target.value)
									}
									placeholder="Food name"
									className="border border-gray-300 bg-white text-gray-800 p-1 w-full rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
								/>
							</div>
							<div className="w-full items-center m-2">
								<label className="block mb-1 font-medium">
									Calories
								</label>
								<input
									type="number"
									value={calories}
									onChange={(e) =>
										setCalories(e.target.value)
									}
									placeholder="Calories/100g"
									className="border p-1 w-full"
								/>
							</div>
						</div>
						<button
							onClick={handleAddFood}
							className="p-2 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
						>
							Add Food
						</button>
					</div>
				)}
			</div>
			{/*Add Calories Logic*/}
			<div className="w-full shadow flex-1 items-center flex flex-col p-2 bg-white mt-4">
				<div className="flex justify-between w-full items-center p-1">
					<div className="uppercase text-orange-500 font-bold text-sm">
						What did you eat?
					</div>
					<div>
						<button
							onClick={handleModalAdd}
							className="w-6 h-6 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-full font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
						>
							+
						</button>
					</div>
				</div>
				{addModalOpen && (
					<div>
						<div className="flex p-1 w-full rounded-sm border-2 justify-between m-2 items-center">
							<div className="mr-2">
								<select
									value={selectedFood}
									onChange={(e) =>
										setSelectedFood(e.target.value)
									}
									className="border border-gray-300 bg-white text-gray-800 p-1 w-full rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
								>
									<option value="" disabled>
										Pick a food
									</option>
									{foodList.map((food: IFood) => (
										<option key={food.id} value={food.id}>
											{food.id.replace(
												currentUser + "%%",
												""
											)}
										</option>
									))}
								</select>
							</div>
							<div className="flex p-1 rounded-lg border">
								<label className="text-black mr-2">Date </label>
								<input
									id="datePicker"
									type="date"
									value={selectedDate}
									onChange={handleDateChange}
									className="border border-gray-300 bg-white text-gray-800 w-full rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
								/>
							</div>
						</div>
						<div className="flex border-2 rounded-sm w-full justify-around items-center">
							<div className="m-1 w-2/3 flex">
								<label className="m-2">Portion</label>
								<input
									type="number"
									value={selectedPortion}
									onChange={handlePortionChange}
									className="border border-gray-300 bg-white text-gray-800 p-1 w-1/2 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
									placeholder="Portion/gr"
								/>
							</div>
							<div className="w-1/3 ">
								<p>
									{selectedFoodDetails
										? `${selectedFoodDetails.caloriesPer100g} kcal/100g`
										: "kcal/100g"}
								</p>
							</div>
						</div>
						<div>
							<button
								onClick={handleSubmit}
								className="mt-2 p-2 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
							>
								submit
							</button>
						</div>
					</div>
				)}
			</div>
			{/*Prev Calories logic*/}
			<div className="w-full shadow flex-1 items-center flex flex-col mt-4">
				<div className="bg-white w-full flex justify-between px-2 rounded-sm flex p-1">
					<label className="uppercase text-orange-500 font-bold text-sm items-center flex">
						Previous days Data
					</label>
					<input
						id="datePicker2"
						type="date"
						value={dateForCalories}
						className="border border-gray-300 bg-white text-gray-800 p-1 w-2/5 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
						onChange={handleDetailPerDayChange}
					/>
				</div>

				{filteredEntries.length > 0 ? (
					<div className="bg-white w-full rounded-sm flex flex-col items-center">
						<div className="flex justify-between w-full items-center p-1 border">
							<div className="mt-2 flex gap-2">
								<p className="uppercase text-black font-bold text-sm">
									Calories {formattedDate}
								</p>
								<p className="uppercase text-orange-500 font-bold text-sm">
									{totalDayCalories.toFixed(2)} kcal
								</p>
							</div>
							<button
								onClick={() => {
									setDateForCalories("");
								}}
								className="right-2 px-2 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-sm font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
							>
								x
							</button>
						</div>

						{isDetailModalOpen && (
							<table className="mt-4 w-full bg-white rounded-sm">
								<thead>
									<tr className="text-left bg-orange-400 text-white">
										<th className="px-1">Food</th>
										<th className="px-1">Portion</th>
										<th className="px-1">Calories</th>
									</tr>
								</thead>
								<tbody>
									{filteredEntries.map((entry, index) => (
										<tr key={index} className="text-black">
											<td className="p-2">
												{entry.foodName}
											</td>
											<td className="p-2">
												{entry.portion}
											</td>
											<td className="p-2">
												{entry.amountOfCalories}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				) : dateForCalories ? (
					<div className="flex gap-4">
						<p className="text-white">No data on {formattedDate}</p>
						<button
							onClick={() => {
								setDateForCalories("");
							}}
							className="right-2 px-2 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-sm font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
						>
							back
						</button>
					</div>
				) : (
					<></>
				)}
				{dateForCalories && (
					<button
						onClick={() => {
							setIsDetailModalOpen((prevState) => !prevState);
						}}
						className="w-1/6 p-1 m-2 text-center text-sm transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
					>
						{isDetailModalOpen ? "Close" : "More"}
					</button>
				)}
			</div>
		</div>
	);
};

export default CaloriesForm;
