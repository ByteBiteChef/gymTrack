import React from "react";

interface ActionButtonProps {
	handleAction: () => void;

	className: string;
	text: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
	handleAction,
	className,
	text,
}) => {
	return (
		<div>
			<button
				className={`w-full h-full ${className} text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95`}
				onClick={handleAction}
			>
				{text}
			</button>
		</div>
	);
};

export default ActionButton;
