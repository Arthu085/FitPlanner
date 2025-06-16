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
	};

	return (
		<form onSubmit={handleSubmit} className={changeClass || defaultClass}>
			{logo && (
				<img src={logo} alt="Logo" className="h-35 mx-auto dark:invert" />
			)}
			<h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
				{title}
			</h2>

			{fields &&
				fields.map((field, index) => (
					<div key={index} className="mb-4">
						<label
							className="block text-sm font-medium mb-1 dark:text-white"
							htmlFor={field.name}>
							{field.label}
						</label>

						{/* Select com busca e multiselect */}
						{field.type === "select" || field.type === "multiselect" ? (
							<Select
								isMulti={field.type === "multiselect"}
								options={field.options}
								value={
									field.type === "multiselect"
										? field.options.filter((opt) =>
												(values[field.name] || []).includes(opt.value)
										  )
										: field.options.find(
												(opt) => opt.value === values[field.name]
										  ) || ""
								}
								onChange={(selected) => {
									const value =
										field.type === "multiselect"
											? selected.map((s) => s.value)
											: selected?.value || "";

									handleChange({
										target: {
											name: field.name,
											value: value,
										},
									});
								}}
								placeholder={field.placeholder || "Selecione..."}
								menuPortalTarget={document.body}
								menuPosition="absolute"
								className="text-black dark:text-white"
								styles={{
									...selectStyles,
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
										maxHeight: "150px",
										width: "100%",
									}),
									menuList: (base) => ({
										...base,
										maxHeight: "150px",
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
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										cursor: "pointer",
										padding: "10px",
										fontSize: "0.95rem",
									}),
									singleValue: (base) => ({
										...base,
										color: theme === "dark" ? "white" : "black",
									}),
									input: (base) => ({
										...base,
										color: theme === "dark" ? "white" : "black",
									}),
									multiValue: (base) => ({
										...base,
										backgroundColor: theme === "dark" ? "#4B5563" : "#d1d5db",
									}),
									multiValueLabel: (base) => ({
										...base,
										color: theme === "dark" ? "white" : "black",
									}),
								}}
							/>
						) : (
							// Input padrão
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
						)}
					</div>
				))}

			<Buttons
				text={btnTitle}
				submit={"submit"}
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
