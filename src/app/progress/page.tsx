import ProgressViewer from "@/components/ProgressViewer";
import { BRAND_BACKGROUND_COLOR } from "@/styles/constants";
import Link from "next/link";
const Progress = () => {
	return (
		<div className="flex flex-col h-screen w-screen">
			<div
				className={`${BRAND_BACKGROUND_COLOR} justify-center items-center flex p-2`}
			>
				<h1>Gym Tracker</h1>
			</div>
			<ProgressViewer />
			<div
				className={`${BRAND_BACKGROUND_COLOR} justify-center items-center flex p-2`}
			>
				<Link href="/">Add training</Link>
			</div>
		</div>
	);
};

export default Progress;
