import "./LoginRegister.css";

// react
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// hooks
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { useToast } from "../../hooks/useToast";

import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import ErrorToast from "../../components/ErrorToast/ErrorToast";
import SuccessToast from "../../components/SuccessToast/SuccessToast";
import Loading from "../../components/Loading/Loading";

const LoginRegister = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [lastName, setLastName] = useState("");
	const {
		errorMessage,
		showError,
		successMessage,
		showSuccess,
		showErrorToast,
		showSuccessToast,
		hideToasts,
	} = useToast();
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const { theme } = useTheme();

	const logoSrc =
		theme === "light"
			? "../../public/images/logo_preto.svg"
			: "../../public/images/logo_branco.svg";

	const { login, register } = useAuth();

	const toggleForm = () => {
		setIsLogin(!isLogin);
		setEmail("");
		setPassword("");
		setName("");
		setLastName("");
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);

		const result = await login(email, password);

		if (!result.success) {
			showErrorToast(result.message);
			setLoading(false);
			return;
		}

		setLoading(false);
		navigate("/home");
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		setLoading(true);

		const result = await register(email, password, name, lastName);

		if (!result.success) {
			showErrorToast(result.message);
			setLoading(false);
			return;
		}

		setLoading(false);
		showSuccessToast(result.message);
		toggleForm();
	};

	return (
		<div className="login-register-container">
			<div className="toast-container auth">
				<ErrorToast
					message={errorMessage}
					show={showError}
					onClose={hideToasts}
				/>
				<SuccessToast
					message={successMessage}
					show={showSuccess}
					onClose={hideToasts}
				/>
			</div>
			{loading && <Loading />}
			<main>
				{isLogin ? (
					<form onSubmit={handleLogin}>
						<div className="logo-img">
							<img className="logo" src={logoSrc} alt="Logo do sistema"></img>
						</div>
						<h2>Entrar</h2>
						<div className="input-label">
							<label>Email</label>
							<input
								type="email"
								name="email-login"
								placeholder="Digite seu Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								autoComplete="email-login"
								required
							/>
						</div>
						<div className="input-label">
							<label>Senha</label>
							<input
								type="password"
								name="password-login"
								placeholder="Digite sua Senha"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="current-password"
								required
							/>
						</div>
						<div className="span-button">
							<span>Ainda não possui uma conta?</span>
							<button
								className="button-toggleform"
								onClick={toggleForm}
								type="button">
								Registrar-se
							</button>
						</div>
						<button className="button-submit" type="submit">
							Entrar
						</button>
					</form>
				) : (
					<form onSubmit={handleRegister}>
						<h2>Registrar-se</h2>
						<div className="input-label">
							<label>Nome</label>
							<input
								type="text"
								name="name"
								placeholder="Digite seu Nome"
								value={name}
								onChange={(e) => setName(e.target.value)}
								autoComplete="given-name"
								required
							/>
						</div>
						<div className="input-label">
							<label>Sobrenome</label>
							<input
								type="text"
								name="last-name"
								placeholder="Digite seu Sobrenome"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								autoComplete="family-name"
								required
							/>
						</div>
						<div className="input-label">
							<label>Email</label>
							<input
								type="email"
								name="email-register"
								placeholder="Digite seu Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								autoComplete="email-register"
								required
							/>
						</div>
						<div className="input-label">
							<label>Senha</label>
							<input
								type="password"
								name="password-register"
								placeholder="Digite sua Senha"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="new-password"
								required
							/>
						</div>
						<div className="span-button">
							<span>Já possui uma conta?</span>
							<button
								className="button-toggleform"
								onClick={toggleForm}
								type="button">
								Login
							</button>
						</div>
						<button className="button-submit" type="submit">
							Registrar-se
						</button>
					</form>
				)}
			</main>
			<div className="theme-toggle">
				<ThemeToggle />
			</div>
		</div>
	);
};

export default LoginRegister;
