import Container from "../../components/Container";
import Form from "../../components/Form";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";

const Login = () => {
	const { login, loading, error } = useAuth();
	const fields = [
		{
			label: "E-mail",
			type: "text",
			name: "email",
			required: true,
			placeholder: "Digite seu e-mail",
		},
		{
			label: "Senha",
			type: "password",
			name: "password",
			required: true,
			placeholder: "Digite sua senha",
		},
	];

	const handleFormSubmit = async (data) => {
		await login(data).then(() => {
			resetForm();
		});
	};

	const { values, handleChange, handleSubmit, resetForm } = useForm(
		{},
		handleFormSubmit
	);

	return (
		<Container centered>
			<Form
				fields={fields}
				values={values}
				handleChange={handleChange}
				handleSubmit={handleSubmit}
				title="Entrar"></Form>
			<div className="absolute bottom-4 left-4">
				<ThemeToggle />
			</div>
		</Container>
	);
};

export default Login;
