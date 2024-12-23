import ProgressViewer from "@/components/ProgressViewer";
import Image from "next/image";

const Progress = () => {
	return (
		<div className="flex flex-col h-screen w-screen bg-[#0a0a0a] overflow-scroll pb-28">
			<div className="bg-[#0a0a0a] justify-center items-center flex border-b border-gray-950">
				<Image
					src="/gym-tracker-logo.png"
					alt="App Logo"
					width={300}
					height={200}
				/>
			</div>
			<ProgressViewer />
		</div>
	);
};

export default Progress;
