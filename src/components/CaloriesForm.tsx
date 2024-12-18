"use client";

import {
	collection,
	doc,
	onSnapshot,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import React, { ChangeEvent, useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { toast } from "sonner";

const CaloriesForm = () => {
	const [currentUser, setCurrentUser] = useState("");
	const [users, setUsers] = useState<string[]>([]);
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [foodName, setFoodName] = useState<string>("");
	const [calories, setCalories] = useState<string>("");
	/* eslint-disable @typescript-eslint/no-explicit-any */
	const [foodList, setFoodList] = useState<any>([]);
	const [selectedFood, setSelectedFood] = useState("");

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedDate(e.target.value);
	};

	useEffect(() => {
		const usersRef = collection(db, "users");
		const unsubscribeUsers = onSnapshot(usersRef, (snapshot) => {
			const userList = snapshot.docs.map((doc) => doc.id);
			setUsers(userList);
		});

		return () => unsubscribeUsers();
	}, []);

	const fetchFood = (user: string) => {
		if (!user) return;

		const foodRef = collection(db, "food");

		const q = query(
			foodRef,
			where("__name__", ">=", user + "%%"),
			where("__name__", "<", user + "%%\uffff")
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const updatedFoodList = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setFoodList(updatedFoodList);
		});

		return () => unsubscribe();
	};

	const handleUserChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setCurrentUser(e.target.value);
	};

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
			setIsModalOpen(false);
		} catch (error) {
			console.error("Error adding food:", error);
			toast.error("Failed to add food.");
		}
	};

	useEffect(() => {
		if (currentUser) {
			const unsubscribe = fetchFood(currentUser);
			return () => unsubscribe && unsubscribe();
		}
	}, [currentUser]);

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
			{/*Add Food Button && Modal*/}
			<div className="flex flex-col items-center">
				{!isModalOpen && (
					<button
						onClick={() => {
							setIsModalOpen(true);
						}}
						className="w-full mt-4 p-1 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
					>
						Add favorite food
					</button>
				)}
				{isModalOpen && (
					<div className="relative w-full shadow flex-1 items-center flex flex-col p-2 bg-white m-2">
						<button
							onClick={() => {
								setIsModalOpen(false);
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
			{!isOpen && (
				<button
					onClick={() => {
						setIsOpen(true);
					}}
					className="w-full mt-4 p-1 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
				>
					add food calories
				</button>
			)}
			{isOpen && (
				<div className="relative w-full shadow flex-1 items-center flex flex-col p-2 bg-white mt-4">
					<button
						onClick={() => {
							setIsOpen(false);
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
							{foodList.map((food: any) => (
								<option key={food.id} value={food.id}>
									{food.id.replace(currentUser + "%%", "")}
								</option>
							))}
						</select>
					</div>
					<div>
						<label>Portion</label>
						<input
							type="number"
							value={""}
							onChange={() => {}}
							className="p-2"
							placeholder="Portion/gr"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default CaloriesForm;
