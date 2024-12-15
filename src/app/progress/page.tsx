import ProgressViewer from "@/components/ProgressViewer";
import Link from "next/link";
const Progress = () => {
	return (
		<div className="flex flex-col h-screen w-screen">
			<div className="bg-background justify-center items-center flex p-2">
				<h1>Gym Tracker</h1>
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
