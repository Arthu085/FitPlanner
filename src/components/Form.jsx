import Buttons from "./Buttons";

import { Link } from "react-router-dom";

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

			<Buttons
				text={btnTitle}
				submit={"submit"}
				disabled={btnDisabled}
				type={btnType}
			/>

			<div className="flex flex-row gap-4 mt-4">
				<p className="text-black dark:text-white">{text}</p>
				<Link
					to={path}
					className="text-black dark:text-white font-bold hover:underline">
					{pathTitle}
				</Link>
			</div>
		</form>
	);
}
