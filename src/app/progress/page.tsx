import ProgressViewer from "@/components/ProgressViewer";
import Image from "next/image";

const Progress = () => {
	return (
		<div className="flex flex-col h-screen w-screen bg-[#0a0a0a] overflow-scroll pb-28">
			<div className="flex justify-center py-4">
				<Image
					src="/gym-stats-logo.png"
					alt="App Logo"
					width={200}
					height={200}
				/>
			</div>
			<ProgressViewer />
		</div>
	);
};

export default Progress;
