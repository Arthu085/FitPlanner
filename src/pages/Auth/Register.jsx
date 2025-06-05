import Container from "../../components/Container";
import Form from "../../components/Form";
import ThemeToggle from "../../components/Theme/ThemeToggle";
import logo from "../../assets/images/logo.svg";
import { useForm } from "../../hooks/useForm";

const Register = () => {
	const fields = [
		{
			label: "Nome",
			type: "text",
			name: "name",
			required: true,
			placeholder: "Digite seu nome",
		},
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
		{
			label: "Confirmar senha",
			type: "password",
			name: "passwordConfirm",
			required: true,
			placeholder: "Confirme sua senha",
		},
	];

	const { values, handleChange, handleSubmit, resetForm } = useForm({});

	return (
		<>
			<Container centered>
				<Form
					title="Cadastrar"
					text={"Já possui uma conta?"}
					handleChange={handleChange}
					handleSubmit={handleSubmit}
					fields={fields}
					values={values}
					path={"/login"}
					pathTitle={"Entrar"}
					logo={logo}></Form>
				<div className="absolute bottom-4 left-4">
					<ThemeToggle />
				</div>
			</Container>
		</>
	);
};

export default Register;
