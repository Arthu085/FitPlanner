import Container from "../../components/Container";
import Form from "../../components/Form";
import ThemeToggle from "../../components/Theme/ThemeToggle";
import logo from "../../assets/images/logo.svg";

import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../../hooks/useToast";

const Login = () => {
	const { login, loading } = useAuth();
	const addToast = useToast();

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
		try {
			const response = await login(data);
			addToast(response.message || "Login realizado com sucesso", "success");
			resetForm();
		} catch (error) {
			addToast(error.message || "Erro ao fazer login", "error");
		}
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
				title="Entrar"
				text={"Não possui uma conta?"}
				path={"/register"}
				pathTitle={"Registrar"}
				logo={logo}
				btnTitle={"Entrar"}
			/>

			<div className="absolute bottom-4 left-4">
				<ThemeToggle />
			</div>
		</Container>
	);
};

export default Login;
