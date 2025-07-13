import Container from "../../components/Container";
import Form from "../../components/Form";
import ThemeToggle from "../../components/Theme/ThemeToggle";
import logo from "../../assets/images/logo.svg";
import LoadingScreen from "../../components/LoadingScreen";

import { useForm } from "../../hooks/useForm";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLoading } from "../../hooks/useLoading";

const Register = () => {
	useEffect(() => {
		localStorage.removeItem("user");
	}, []);

	const { register } = useAuth();
	const addToast = useToast();
	const { isLoading, setIsLoading } = useLoading();

	const [btnDisabled, setBtnDisabled] = useState(false);

	const navigate = useNavigate();

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

	const handleFormSubmit = async (data) => {
		if (data.password !== data.passwordConfirm) {
			addToast("As senhas devem ser iguais", "error");
			return;
		}
		if (btnDisabled) return;
		setBtnDisabled(true);
		setIsLoading(true);
		try {
			const response = await register(data);
			addToast(response.message || "Cadastro realizado com sucesso", "success");
			navigate("/login");
			resetForm();
		} catch (error) {
			addToast(error.message || "Erro ao fazer login", "error");
		} finally {
			setIsLoading(false);
			setBtnDisabled(false);
		}
	};

	const { values, handleChange, handleSubmit, resetForm } = useForm(
		{},
		handleFormSubmit
	);

	return (
		<>
			{isLoading && <LoadingScreen />}

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
					logo={logo}
					btnTitle={"Cadastrar"}
					btnDisabled={btnDisabled}
					btnType={"primary"}
				/>

				<div className="absolute bottom-4 left-4">
					<ThemeToggle />
				</div>
			</Container>
		</>
	);
};

export default Register;
