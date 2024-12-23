import React, { ChangeEvent } from "react";
import ActionButton from "./ActionButton";

interface UserSelectInputProps {
	currentUser: string;
	users: string[];
	handleUserChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	handleCloseSelect: () => void;
}

const UserSelectInput: React.FC<UserSelectInputProps> = ({
	currentUser,
	users,
	handleUserChange,
	handleCloseSelect,
}) => {
	return (
		<div className="flex gap-1">
			<select
				value={currentUser}
				onChange={handleUserChange}
				className="border border-gray-300 bg-white text-gray-800 p-1 w-full rounded-sm appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
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
			<div>
				<ActionButton
					className="p-2 rounded-sm"
					text="X"
					handleAction={handleCloseSelect}
				/>
			</div>
		</div>
	);
};

export default UserSelectInput;
