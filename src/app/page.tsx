import ExerciseForm from "@/components/formComponent/ExerciseForm";

const Home = () => {
	return (
		<div className="flex flex-col h-screen w-screen">
			<div className="bg-green-200 justify-center items-center flex">
				<h1>Gym Tracker</h1>
			</div>
			<ExerciseForm />
		</div>
	);
};

export default Home;
