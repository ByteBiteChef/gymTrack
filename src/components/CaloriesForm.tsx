"use client";

import { collection, onSnapshot } from "firebase/firestore";
import React, { ChangeEvent, useEffect, useState } from "react";
import { db } from "../../firebase/firebase";

const CaloriesForm = () => {
	const [currentUser, setCurrentUser] = useState("");
	const [users, setUsers] = useState<string[]>([]);
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [foodName, setFoodName] = useState<string>("");
	const [calories, setCalories] = useState<string>("");

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
					{selectedDate && <p>Selected Date: {selectedDate}</p>}
				</div>
			</div>
			<div className="flex flex-col items-center">
				<button
					onClick={() => {
						setIsOpen(true);
					}}
					className="w-1/3 p-2 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
				>
					Add New Food
				</button>
				{isOpen && (
					<div className="relative w-full shadow flex-1 items-center flex flex-col p-2 bg-white m-2">
						<button
							onClick={() => {
								setIsOpen(false);
							}}
							className="absolute right-1 px-2 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-md font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
						>
							X
						</button>
						<div className="items-center mb-2 mt-2">
							<label className="block mb-1 font-medium">
								Food Name
							</label>
							<input
								type="text"
								value={foodName}
								onChange={(e) => setFoodName(e.target.value)}
								placeholder="Food name"
								className="border p-2 w-full"
							/>
						</div>

						<div className="items-center mb-2">
							<label className="block mb-1 font-medium">
								Calories
							</label>
							<input
								type="text"
								value={calories}
								onChange={(e) => setCalories(e.target.value)}
								placeholder="Calories/100g"
								className="border p-2 w-full"
							/>
						</div>
						<div>
							<button
								onClick={() => {
									console.log("Food Name:", foodName);
									console.log("Calories:", calories);
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
