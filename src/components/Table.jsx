export default function Table({ headers, data = [], renderActions }) {
	return (
		<div className="w-full overflow-x-auto">
			<table className="w-full table-auto border-collapse rounded-lg overflow-hidden">
				<thead className="bg-gray-200 dark:bg-gray-950">
					<tr>
						{headers.map((header, idx) => (
							<th
								key={idx}
								className="px-4 py-3 text-left font-semibold text-sm text-gray-800 dark:text-gray-300 border-b">
								{header}
							</th>
						))}
						{renderActions && (
							<th className="px-4 py-3 text-left font-semibold text-sm text-gray-800 dark:text-gray-100 border-b">
								Ações
							</th>
						)}
					</tr>
				</thead>
				<tbody>
					{data.map((row, rowIndex) => (
						<tr
							key={rowIndex}
							className={`${
								rowIndex % 2 === 0
									? "bg-gray-100 dark:bg-gray-800"
									: "bg-white dark:bg-gray-900"
							} border-b`}>
							{row.map((cell, cellIndex) => (
								<td
									key={cellIndex}
									className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
									{cell}
								</td>
							))}
							{renderActions && (
								<td className="px-4 py-3">{renderActions(row)}</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
