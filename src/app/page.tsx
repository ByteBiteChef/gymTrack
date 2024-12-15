import ExerciseForm from "@/components/formComponent/ExerciseForm";
import { BRAND_BACKGROUND_COLOR } from "@/styles/constants";

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
				<a href="/progress">Progress</a>
			</div>
		</div>
	);
};

export default Home;
