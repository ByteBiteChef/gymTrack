import ExerciseForm from "@/components/ExerciseForm";
import Image from "next/image";

const Home = () => {
	return (
		<div className="flex flex-col h-screen w-screen bg-[#0a0a0a] overflow-scroll pb-28">
			<div className="flex justify-center py-4 mt-6">
				<Image
					src="/gym-tracker.png"
					alt="App Logo"
					width={250}
					height={200}
				/>
			</div>

			<ExerciseForm />
		</div>
	);
};

export default Home;
