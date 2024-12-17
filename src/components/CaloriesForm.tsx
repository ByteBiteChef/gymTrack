"use client";

import { collection, onSnapshot } from "firebase/firestore";
import React, { ChangeEvent, useEffect, useState } from "react";
import { db } from "../../firebase/firebase";

const CaloriesForm = () => {
	const [currentUser, setCurrentUser] = useState("");
	const [users, setUsers] = useState<string[]>([]);
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [foodName, setFoodName] = useState<string>("");
	const [calories, setCalories] = useState<string>("");
	const [portion, setPortion] = useState<string>("");

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

	const handleUserChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setCurrentUser(e.target.value);
	};

	return (
		<div className="flex flex-col border h-auto rounded-md m-4 p-4 border-orange-400">
			{/*Pick User Select && Date Picker*/}
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
				<div>
					<label className="text-white">Pick a date </label>
					<input
						id="datePicker"
						type="date"
						value={selectedDate}
						onChange={handleDateChange}
					/>
				</div>
			</div>
			{/*Add Food Button && Modal*/}
			<div className="flex flex-col items-center">
				<button
					onClick={() => {
						setIsModalOpen(true);
					}}
					className="w-full mt-4 p-1 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
				>
					Add Food
				</button>
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
						<div className="w-full items-center m-2">
							<label className="block mb-1 font-medium">
								Portion
							</label>
							<input
								type="number"
								value={portion}
								onChange={(e) => setPortion(e.target.value)}
								placeholder="Portion in gr"
								className="border p-1 w-full"
							/>
						</div>
						<div>
							<button
								onClick={() => {
									console.log("User:", currentUser);
									console.log("Food Name:", foodName);
									console.log("Calories:", calories);
									console.log("Date:", selectedDate);
									setCalories("");
									setFoodName("");
								}}
								className="ml-4 p-2 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
							>
								Add Food
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CaloriesForm;
