import Buttons from "./Buttons";

export default function Form({
	fields,
	values,
	handleChange,
	handleSubmit,
	title,
}) {
	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-8 w-full max-w-md mx-auto transition-colors duration-300">
			<h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
				{title}
			</h2>

			{fields.map((field, index) => (
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
				text={"Entrar"}
				colorBg={"bg-blue-500"}
				colorHover={"hover:bg-blue-700"}
				submit={"submit"}></Buttons>
		</form>
	);
}
