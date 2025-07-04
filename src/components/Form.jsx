import Select from "react-select";
import Buttons from "./Buttons";

import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

export default function Form({
	fields,
	values,
	handleChange,
	handleSubmit,
	title,
	text,
	path,
	pathTitle,
	logo,
	btnTitle,
	btnDisabled,
	btnType,
	changeClass,
	exerciseOptions,
	showNotesAndWeight = false,
}) {
	const defaultClass =
		"bg-white dark:bg-gray-900 shadow-md rounded-xl p-8 w-full max-w-md mx-auto mb-4 mt-4 transition-colors duration-300";

	const { theme } = useTheme();

	const selectStyles = {
		control: (base) => ({
			...base,
			backgroundColor: theme === "dark" ? "#374151" : "white",
			borderColor: theme === "dark" ? "#4B5563" : "#D1D5DB",
			color: theme === "dark" ? "white" : "black",
			minHeight: "44px",
			width: "100%",
			boxShadow: "none",
		}),
		menuList: (base) => ({
			...base,
			maxHeight: "200px",
			overflowY: "auto",
		}),
		menuPortal: (base) => ({
			...base,
			zIndex: 9999,
		}),
		placeholder: (base) => ({
			...base,
			color: theme === "dark" ? "#9CA3AF" : "#4B5563",
		}),
		menu: (base) => ({
			...base,
			backgroundColor: theme === "dark" ? "#374151" : "white",
			color: theme === "dark" ? "white" : "black",
		}),
		option: (base, { isFocused, isSelected }) => ({
			...base,
			backgroundColor: isFocused
				? theme === "dark"
					? "#4B5563"
					: "#d1d5db"
				: isSelected
				? theme === "dark"
					? "#1F2937"
					: "#e5e7eb"
				: theme === "dark"
				? "#374151"
				: "white",
			color: theme === "dark" ? "white" : "black",
			cursor: "pointer",
			padding: "10px",
			fontSize: "0.95rem",
		}),
		multiValue: (base) => ({
			...base,
			backgroundColor: theme === "dark" ? "#4B5563" : "#d1d5db",
		}),
		multiValueLabel: (base) => ({
			...base,
			color: theme === "dark" ? "white" : "black",
		}),
		singleValue: (base) => ({
			...base,
			color: theme === "dark" ? "white" : "black",
		}),
		input: (base) => ({
			...base,
			color: theme === "dark" ? "white" : "black",
		}),
	};

	const selectedExercises =
		values.exercise && Array.isArray(values.exercise)
			? values.exercise.map((opt) => ({
					id_exercise: opt.id_exercise ?? opt.value,
					id_exercise_workout: opt.id_exercise_workout,
					series: opt.series || 3,
					repetitions: opt.repetitions || 10,
					label: opt.label,
					value: opt.value ?? opt.id_exercise,
					weight: opt.weight ?? "",
					notes: opt.notes ?? "",
			  }))
			: [];

	const handleExerciseChange = (selectedOptions) => {
		const updated = (selectedOptions || []).map((opt) => {
			const existing = (values.exercise || []).find(
				(ex) => (ex.id_exercise ?? ex.value) === opt.value
			);

			return {
				value: opt.value,
				label: opt.label,
				id_exercise: opt.value,
				id_exercise_workout: existing?.id_exercise_workout,
				series: existing?.series || 3,
				repetitions: existing?.repetitions || 10,
			};
		});

		handleChange({
			target: {
				name: "exercise",
				value: updated,
			},
		});
	};

	const handleSeriesChange = (index, series) => {
		const newExercises = [...(values.exercise || [])];
		newExercises[index] = {
			...newExercises[index],
			series,
		};
		handleChange({
			target: {
				name: "exercise",
				value: newExercises,
			},
		});
	};

	const handleRepetitionsChange = (index, repetitions) => {
		const newExercises = [...(values.exercise || [])];
		newExercises[index] = {
			...newExercises[index],
			repetitions,
		};
		handleChange({
			target: {
				name: "exercise",
				value: newExercises,
			},
		});
	};

	return (
		<form onSubmit={handleSubmit} className={changeClass || defaultClass}>
			{logo && (
				<img src={logo} alt="Logo" className="h-35 mx-auto dark:invert" />
			)}
			<h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
				{title}
			</h2>

			{/* Renderiza os outros campos */}
			{fields
				?.filter((field) => field.name !== "exercise")
				.map((field, index) => (
					<div key={index} className="mb-4">
						<label
							className="block text-sm font-medium mb-1 dark:text-white"
							htmlFor={field.name}>
							{field.label}
						</label>
						<input
							type={field.type}
							id={field.name}
							name={field.name}
							value={values[field.name] || ""}
							onChange={handleChange}
							placeholder={field.placeholder}
							className="placeholder:text-gray-600 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-700 dark:placeholder:text-gray-400 dark:focus:ring-blue-200 text-black dark:text-white"
							required={field.required}
						/>
					</div>
				))}

			{fields.some((field) => field.name === "exercise") && (
				<>
					{/* Multiselect de exercícios */}
					<div className="mb-4">
						<label className="block text-sm font-medium mb-1 dark:text-white">
							Exercícios
						</label>
						<Select
							isMulti
							options={exerciseOptions || []}
							value={(exerciseOptions || []).filter((opt) =>
								selectedExercises.some((ex) => ex.id_exercise === opt.value)
							)}
							onChange={handleExerciseChange}
							placeholder="Selecione os exercícios"
							menuPortalTarget={document.body}
							menuPosition="absolute"
							className="text-black dark:text-white"
							styles={selectStyles}
						/>
					</div>

					{/* Inputs de séries e repetições */}
					{selectedExercises.map((exercise, index) => {
						const label = (exerciseOptions || []).find(
							(e) => e.value === exercise.id_exercise
						)?.label;
						return (
							<div
								key={exercise.id_exercise}
								className="mb-4 border border-gray-300 dark:border-gray-700 p-3 rounded-lg">
								<p className="font-semibold mb-2 dark:text-white">{label}</p>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label
											className="block text-sm font-medium mb-1 dark:text-white"
											htmlFor={`series-${exercise.id_exercise}`}>
											Séries
										</label>
										<select
											id={`series-${exercise.id_exercise}`}
											value={exercise.series}
											onChange={(e) =>
												handleSeriesChange(index, parseInt(e.target.value))
											}
											className="w-full border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white">
											{[1, 2, 3, 4, 5].map((n) => (
												<option key={n} value={n}>
													{n}
												</option>
											))}
										</select>
									</div>

									<div>
										<label
											className="block text-sm font-medium mb-1 dark:text-white"
											htmlFor={`repetitions-${exercise.id_exercise}`}>
											Repetições
										</label>
										<select
											id={`repetitions-${exercise.id_exercise}`}
											value={exercise.repetitions}
											onChange={(e) =>
												handleRepetitionsChange(index, parseInt(e.target.value))
											}
											className="w-full border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white">
											{[6, 8, 10, 12, 15, 20].map((n) => (
												<option key={n} value={n}>
													{n}
												</option>
											))}
										</select>
									</div>

									{showNotesAndWeight && (
										<>
											<div>
												<label
													className="block text-sm font-medium mb-1 dark:text-white"
													htmlFor={`weight-${exercise.id_exercise}`}>
													Peso (kg)
												</label>
												<input
													type="number"
													step="0.1"
													id={`weight-${exercise.id_exercise}`}
													value={exercise.weight || ""}
													onChange={(e) => {
														const newExercises = [...selectedExercises];
														newExercises[index].weight = e.target.value;
														handleChange({
															target: {
																name: "exercise",
																value: newExercises,
															},
														});
													}}
													placeholder="Ex: 50.5"
													className="w-full border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
												/>
											</div>

											<div>
												<label
													className="block text-sm font-medium mb-1 dark:text-white"
													htmlFor={`notes-${exercise.id_exercise}`}>
													Notas
												</label>
												<input
													type="text"
													id={`notes-${exercise.id_exercise}`}
													value={exercise.notes || ""}
													onChange={(e) => {
														const newExercises = [...selectedExercises];
														newExercises[index].notes = e.target.value;
														handleChange({
															target: {
																name: "exercise",
																value: newExercises,
															},
														});
													}}
													placeholder="Observações"
													className="w-full border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
												/>
											</div>
										</>
									)}
								</div>
							</div>
						);
					})}
				</>
			)}

			<Buttons
				text={btnTitle}
				submit="submit"
				disabled={btnDisabled}
				type={btnType}
			/>

			{path && (
				<div className="flex flex-row gap-4 mt-4">
					<p className="text-black dark:text-white">{text}</p>
					<Link
						to={path}
						className="text-black dark:text-white font-bold hover:underline">
						{pathTitle}
					</Link>
				</div>
			)}
		</form>
	);
}
