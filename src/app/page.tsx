import ExerciseForm from "@/components/ExerciseForm";
import Link from "next/link";
import Image from "next/image";

const Home = () => {
	return (
		<div className="flex flex-col h-screen w-screen bg-[#0a0a0a] overflow-scroll">
			<div className="bg-[#0a0a0a] justify-center items-center flex border-b border-gray-950">
				<Image
					src="/gym-tracker-logo.png"
					alt="App Logo"
					width={300}
					height={200}
				/>
			</div>
			<ExerciseForm />
			<div className="flex w-full items-center justify-center">
				<div className="m-2 px-4 py-2 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white rounded-lg font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95">
					<Link href="/progress">Progress</Link>
				</div>
			</div>
		</div>
	);
};

export default Home;
