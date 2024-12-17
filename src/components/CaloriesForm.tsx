"use client";

import { collection, onSnapshot } from "firebase/firestore";
import React, { ChangeEvent, useEffect, useState } from "react";
import { db } from "../../firebase/firebase";

const CaloriesForm = () => {
	const [currentUser, setCurrentUser] = useState("");
	const [users, setUsers] = useState<string[]>([]);
	const [selectedDate, setSelectedDate] = useState<string>("");

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
	);
};

export default CaloriesForm;
