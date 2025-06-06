"use client";

import { arrayUnion, doc, setDoc } from "firebase/firestore";
import React, { ChangeEvent, useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { toast } from "sonner";
import { fetchDailyCalories, fetchFood } from "../services/allServices";
import { IDailyCalories, IFood } from "@/services/types";
import CaloriesGoalChart from "./CaloriesGoalChart";
import ActionButton from "./ActionButton";
import Card from "./DefaultCard";
import NavBar from "./NavBar";

const CaloriesForm = () => {
	//users states
	const [currentUser, setCurrentUser] = useState("");

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
	const [caloriesPerDayModalOpen, setCaloriesPerDayModalOpen] =
		useState<boolean>(false);

	useEffect(() => {
		const savedUser = localStorage.getItem("selectedUser");
		if (savedUser) {
			setCurrentUser(savedUser);
		} else {
			console.warn("No user found in localStorage.");
		}
	}, []);

	//Fetch Daily Calories by currentUser
	useEffect(() => {
		if (currentUser) {
			// Set up subscription
			const unsubscribe = fetchDailyCalories(
				currentUser,
				(data) => setDailyCalories(data) // Update state when data changes
			);
			// Cleanup listener on unmount or when currentUser changes
			return () => unsubscribe();
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

	const handleModalAdd = () => {
		setAddModalOpen((prevState) => !prevState);
	};

	return (
		<div className="flex flex-col border h-auto rounded-md m-4 p-4 border-orange-400">
			{!currentUser ? (
				<p className="text-white">Loading user...</p>
			) : null}

			{/*Calories goal*/}
			{currentUser && (
				<div>
					<CaloriesGoalChart
						dailyCalories={dailyCalories}
						currentUser={currentUser}
					/>

					{/*Add New Food Button && Modal*/}
					<div className="flex flex-col items-center">
						{!isNewFoodModalOpen && (
							<ActionButton
								handleAction={() => {
									setIsNewFoodModalOpen(true);
								}}
								text="Add products"
								className="p-2 mt-4 rounded-sm"
							/>
						)}
						{isNewFoodModalOpen && (
							<Card className="relative">
								<div className="absolute right-2">
									<ActionButton
										handleAction={() => {
											setIsNewFoodModalOpen(false);
										}}
										className="rounded-sm right-2 px-2"
										text="x"
									/>
								</div>
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
											className="border border-gray-300 bg-white text-gray-800 p-1 w-full rounded-sm appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
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

								<ActionButton
									handleAction={handleAddFood}
									text="Add Food"
									className="p-2 rounded-sm"
								/>
							</Card>
						)}
					</div>
					{/*Add Calories Logic*/}
					<div className="w-full items-center flex flex-col bg-white mt-4 rounded-sm">
						<button
							onClick={handleModalAdd}
							className="uppercase text-orange-500 font-bold text-sm p-2 w-full text-center"
						>
							What did you eat?
						</button>

						{addModalOpen && (
							<div className="flex flex-col w-full">
								<div className="flex gap-2 p-1 w-full rounded-sm border-t-2 justify-between items-center">
									<select
										value={selectedFood}
										onChange={(e) =>
											setSelectedFood(e.target.value)
										}
										className="border border-gray-300 bg-white text-gray-800 p-1 w-1/2 rounded-sm appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
									>
										<option value="" disabled>
											Pick a food
										</option>
										{foodList.map((food: IFood) => (
											<option
												key={food.id}
												value={food.id}
											>
												{food.id.replace(
													currentUser + "%%",
													""
												)}
											</option>
										))}
									</select>
									<input
										id="datePicker"
										placeholder="Date"
										type="date"
										value={
											selectedDate ||
											new Date()
												.toISOString()
												.split("T")[0]
										}
										onChange={handleDateChange}
										className="p-1 border border-gray-300 bg-white text-gray-800 w-1/2 rounded-sm appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
									/>
								</div>
								<div className="flex border-t-2 w-full justify-between items-center gap-2 p-1">
									<input
										type="number"
										value={selectedPortion}
										onChange={handlePortionChange}
										className="border border-gray-300 bg-white text-gray-800 p-1 w-1/2 rounded-sm appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
										placeholder="Portion in gr"
									/>

									<p className="border border-gray-300 rounded-sm w-1/2 p-1">
										{selectedFoodDetails
											? `${selectedFoodDetails.caloriesPer100g} kcal/100g`
											: "kcal/100g"}
									</p>
								</div>
								<ActionButton
									handleAction={handleSubmit}
									text="submit"
									className="p-1 mt-4"
								/>
							</div>
						)}
					</div>
					{/*Prev Calories logic*/}
					<div className="w-full shadow flex-1 items-center flex flex-col">
						<div className="w-full items-center flex flex-col bg-white mt-4 rounded-sm">
							<button
								onClick={() => {
									setCaloriesPerDayModalOpen(
										(prevState) => !prevState
									);
								}}
								className="uppercase text-orange-500 font-bold text-sm p-2 w-full text-center"
							>
								Previous days Data
							</button>
						</div>
						{caloriesPerDayModalOpen && (
							<div className="w-full items-center flex bg-white justify-center">
								<label className="block mb-1 font-medium ">
									Select a date
								</label>
								<input
									id="datePicker2"
									type="date"
									value={dateForCalories}
									className="border border-gray-300 bg-white text-gray-800 m-2 p-1 h-8 w-2/5 rounded-sm appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
									onChange={handleDetailPerDayChange}
								/>
							</div>
						)}

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
									<ActionButton
										handleAction={() => {
											setDateForCalories("");
										}}
										text="X"
										className="px-2 right-2 rounded-sm"
									/>
								</div>

								{isDetailModalOpen && (
									<table className="mt-4 w-full bg-white rounded-sm">
										<thead>
											<tr className="text-left bg-orange-400 text-white">
												<th className="px-1">Food</th>
												<th className="px-1">
													Portion
												</th>
												<th className="px-1">
													Calories
												</th>
											</tr>
										</thead>
										<tbody>
											{filteredEntries.map(
												(entry, index) => (
													<tr
														key={index}
														className="text-black"
													>
														<td className="p-2">
															{entry.foodName}
														</td>
														<td className="p-2">
															{entry.portion}
														</td>
														<td className="p-2">
															{
																entry.amountOfCalories
															}
														</td>
													</tr>
												)
											)}
										</tbody>
									</table>
								)}
							</div>
						) : dateForCalories ? (
							<div className="w-full bg-white p-2 flex items-center justify-center gap-4">
								<p>No data on {formattedDate}</p>

								<div className="right-2 px-2">
									<ActionButton
										handleAction={() => {
											setDateForCalories("");
										}}
										text="x"
										className="px-2 rounded-sm"
									/>
								</div>
							</div>
						) : (
							<></>
						)}
						{filteredEntries.length > 0 && (
							<div className="w-full bg-white flex items-center justify-center p-4">
								<ActionButton
									text={isDetailModalOpen ? "Close" : "More"}
									handleAction={() => {
										setIsDetailModalOpen(
											(prevState) => !prevState
										);
									}}
									className="p-1 px-2 rounded-sm"
								/>
							</div>
						)}
					</div>
				</div>
			)}
			<NavBar user={currentUser} />
		</div>
	);
};

export default CaloriesForm;
