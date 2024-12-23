import ProgressViewer from "@/components/ProgressViewer";

const Progress = () => {
	return (
		<div className="flex flex-col h-screen w-screen bg-[#0a0a0a] overflow-scroll pb-28">
			<ProgressViewer />
		</div>
	);
};

export default Progress;
