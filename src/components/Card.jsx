export default function Card({
	data = [],
	renderActions,
	renderContent,
	titleKey = "title",
	title,
	onclick,
	cursor,
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
						className={`
							bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 flex flex-col justify-between
							transform transition-all duration-300 ease-in-out
							hover:scale-[1.02] hover:shadow-xl hover:ring-2 hover:ring-blue-400/50
							active:scale-[0.98] active:shadow-md
							${cursor}
						`}
						onClick={() => onclick?.(item)}>
						<div className="mb-3">
							<h2 className="text-lg font-semibold text-gray-900 dark:text-white break-words">
								{title}
							</h2>
							<p className="text-md font-medium text-gray-900 dark:text-white break-words">
								{item[titleKey]}
							</p>
						</div>

						<div className="flex-1 text-gray-700 dark:text-white mb-4 text-sm max-h-[15vh] overflow-y-auto pr-2 custom-scrollbar">
							{renderContent ? renderContent(item) : ""}
						</div>

						{renderActions && (
							<div className="flex gap-2">{renderActions(item)}</div>
						)}
					</div>
				))
			)}
		</div>
	);
}
