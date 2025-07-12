export default function LoadingScreen() {
	return (
		<div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50">
			<div className="flex flex-col items-center gap-4">
				<div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
			</div>
		</div>
	);
}
