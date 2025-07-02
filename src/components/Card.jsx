export default function Card({
	data = [],
	renderActions,
	renderContent,
	titleKey = "title",
}) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
			{data.length === 0 ? (
				<div className="col-span-full text-center text-gray-800 dark:text-white">
					Nenhum dado encontrado.
				</div>
			) : (
				data.map((item, index) => (
					<div
						key={index}
						className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 flex flex-col justify-between
							transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg ">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
							{item[titleKey]}
						</h2>

						<div className="flex-1 text-gray-700 dark:text-white mb-4 text-sm max-h-[15vh] overflow-y-auto pr-2 custom-scrollbar">
							{renderContent ? renderContent(item) : ""}
						</div>

						{renderActions && (
							<div className="flex  gap-2">{renderActions(item)}</div>
						)}
					</div>
				))
			)}
		</div>
	);
}
