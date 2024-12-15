import ExerciseForm from "@/components/ExerciseForm";
import Link from "next/link";

const Home = () => {
	return (
		<div className="flex flex-col h-screen w-screen">
			<div className="bg-background justify-center items-center flex p-2">
				<h1>Gym Tracker</h1>
			</div>
			<ExerciseForm />
			<div className="flex w-full items-center justify-center">
				<div className="bg-background justify-center items-center w-1/2 flex p-2">
					<Link href="/progress">Progress</Link>
				</div>
			</div>
		</div>
	);
};

export default Home;
