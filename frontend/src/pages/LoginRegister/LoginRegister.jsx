import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./LoginRegister.css";

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
		await login(email, password);
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		const success = await register(name, lastName, email, password);
		if (success) toggleForm();
	};

	return (
		<div className="login-register-container">
			<main>
				{isLogin ? (
					<form onSubmit={handleLogin}>
						<h2>Login</h2>
						<div className="input-label">
							<label htmlFor="email-login">Email</label>
							<input
								type="email"
								id="email-login"
								placeholder="Digite seu Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								autoComplete="email-login"
							/>
						</div>
						<div className="input-label">
							<label htmlFor="password-login">Senha</label>
							<input
								type="password"
								id="password-login"
								placeholder="Digite sua Senha"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								autoComplete="current-password"
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
							<label htmlFor="name">Nome</label>
							<input
								type="text"
								id="name"
								placeholder="Digite seu Nome"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								autoComplete="given-name"
							/>
						</div>
						<div className="input-label">
							<label htmlFor="last-name">Sobrenome</label>
							<input
								type="text"
								id="last-name"
								placeholder="Digite seu Sobrenome"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								required
								autoComplete="family-name"
							/>
						</div>
						<div className="input-label">
							<label htmlFor="email-register">Email</label>
							<input
								type="email"
								id="email-register"
								placeholder="Digite seu Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								autoComplete="email-register"
							/>
						</div>
						<div className="input-label">
							<label htmlFor="password-register">Senha</label>
							<input
								type="password"
								id="password-register"
								placeholder="Digite sua Senha"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								autoComplete="new-password"
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
