import React from "react";
interface CardProps {
	children: React.ReactNode;
	className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
	return (
		<div
			className={`items-center flex flex-col p-4 bg-white mt-4 rounded-sm w-full ${className}`}
		>
			{children}
		</div>
	);
};

export default Card;
