import React, { ChangeEvent } from "react";

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
		<div className="flex">
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

			<button
				onClick={handleCloseSelect}
				className="w-auto ml-1 px-2 text-center text-xs uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-sm font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
			>
				x
			</button>
		</div>
	);
};

export default UserSelectInput;
