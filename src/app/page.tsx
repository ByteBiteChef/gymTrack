import ExerciseForm from "@/components/ExerciseForm";
import Link from "next/link";
import Image from "next/image";

const Home = () => {
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
			<ExerciseForm />
			<div className="flex w-full items-center justify-center">
				<div className="bg-background justify-center items-center w-1/2 flex p-2 mb-8">
					<Link href="/progress">Progress</Link>
				</div>
			</div>
		</div>
	);
};

export default Home;
