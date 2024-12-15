import ExerciseForm from "@/components/ExerciseForm";
import { BRAND_BACKGROUND_COLOR } from "@/styles/constants";
import Link from "next/link";

const Home = () => {
	return (
		<div className="flex flex-col h-screen w-screen">
			<div
				className={`${BRAND_BACKGROUND_COLOR} justify-center items-center flex p-2`}
			>
				<h1>Gym Tracker</h1>
			</div>
			<ExerciseForm />
			<div
				className={`${BRAND_BACKGROUND_COLOR} justify-center items-center flex p-2`}
			>
				<Link href="/progress">Progress</Link>
			</div>
		</div>
	);
};

export default Home;
