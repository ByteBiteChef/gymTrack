import ProgressViewer from "@/components/ProgressViewer";
import Link from "next/link";
import Image from "next/image";

const Progress = () => {
	return (
		<div className="flex flex-col h-screen w-screen">
			<div className="bg-gray-950 justify-center items-center flex">
				<Image
					src="/gym-tracker-logo.png"
					alt="App Logo"
					width={250}
					height={200}
				/>
			</div>
			<ProgressViewer />
			<div className="flex w-full items-center justify-center">
				<div className="bg-background justify-center items-center w-1/2 flex p-2">
					<Link href="/">Add training</Link>
				</div>
			</div>
		</div>
	);
};

export default Progress;
