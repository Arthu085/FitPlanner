import "./LoginRegister.css";

// react
import { useState } from "react";

// hooks
import { useAuth } from "../../hooks/useAuth";

const LoginRegister = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [lastName, setLastName] = useState("");

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

		if (!email.trim() || !password.trim()) {
			alert("Preencha o e-mail e a senha corretamente.");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			alert("Por favor, insira um e-mail válido.");
			return;
		}

		await login(email, password);
	};

	const handleRegister = async (e) => {
		e.preventDefault();

		const trimmedEmail = email.trim();
		const trimmedPassword = password.trim();
		const trimmedName = name.trim();
		const trimmedLastName = lastName.trim();

		if (!trimmedEmail || !trimmedPassword || !trimmedName || !trimmedLastName) {
			alert("Preencha todos os campos");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(trimmedEmail)) {
			alert("Por favor, insira um e-mail válido.");
			return;
		}

		if (password.length < 6) {
			alert("A senha deve ter no mínimo 6 caracteres.");
			return;
		}

		const success = await register(email, password, name, lastName);
		if (success) toggleForm();
	};

	return (
		<div className="login-register-container">
			<main>
				{isLogin ? (
					<form onSubmit={handleLogin}>
						<h2>Login</h2>
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
		</div>
	);
};

export default LoginRegister;
