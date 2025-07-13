import Container from "../../components/Container";
import Form from "../../components/Form";
import ThemeToggle from "../../components/Theme/ThemeToggle";
import logo from "../../assets/images/logo.svg";
import LoadingScreen from "../../components/LoadingScreen";

import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoading } from "../../hooks/useLoading";

const Login = () => {
	useEffect(() => {
		localStorage.removeItem("user");
	}, []);

	const { login } = useAuth();
	const addToast = useToast();

	const { isLoading, setIsLoading } = useLoading();
	const [btnDisabled, setBtnDisabled] = useState(false);

	const navigate = useNavigate();

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
		if (btnDisabled) return;
		setBtnDisabled(true);
		setIsLoading(true);
		try {
			const response = await login(data);
			addToast(response.message || "Login realizado com sucesso", "success");
			resetForm();
			navigate("/");
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

export default Login;
