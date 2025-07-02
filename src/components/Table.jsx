export default function Table({ headers, data = [], renderActions }) {
	return (
		<div className="w-full overflow-x-auto">
			<table className="w-full table-auto border-collapse rounded-lg overflow-hidden">
				{data.length > 0 && (
					<thead className="bg-gray-200 dark:bg-gray-950">
						<tr>
							{headers.map((header, idx) => (
								<th
									key={idx}
									className="px-4 py-3 text-left font-semibold text-sm text-black dark:text-white border-b">
									{header.label}
								</th>
							))}
							{renderActions && (
								<th className="px-4 py-3 text-left font-semibold text-sm text-black dark:text-white border-b">
									Ações
								</th>
							)}
						</tr>
					</thead>
				)}
				<tbody>
					{data.length === 0 ? (
						<tr>
							<td
								colSpan={headers.length + (renderActions ? 1 : 0)}
								className="text-center py-4 text-black dark:text-white">
								Nenhum dado encontrado.
							</td>
						</tr>
					) : (
						data.map((row, rowIndex) => (
							<tr
								key={rowIndex}
								className={`${
									rowIndex % 2 === 0
										? "bg-gray-100 dark:bg-gray-800"
										: "bg-white dark:bg-gray-900"
								} border-b`}>
								{headers.map((header, cellIndex) => (
									<td
										key={cellIndex}
										className="px-4 py-3 text-sm text-black dark:text-white">
										{row[header.key]}
									</td>
								))}
								{renderActions && (
									<td className="px-4 py-3">{renderActions(row)}</td>
								)}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
