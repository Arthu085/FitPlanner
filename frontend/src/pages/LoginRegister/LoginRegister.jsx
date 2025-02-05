import { useState } from 'react'
import './LoginRegister.css'

const LoginRegister = () => {

    const [formVisibleRegister, setformVisibleRegister] = useState(false);
    const [formVisibleLogin, setformVisibleLogin] = useState(true);
    const [email_user, setEmail] = useState('');
    const [password_user, setPassword] = useState('');
    const [name_user, setName] = useState('');
    const [lastname_user, setLastName] = useState('');

    const toggleForm = () => {
        setformVisibleRegister(!formVisibleRegister);
        setformVisibleLogin(!formVisibleLogin);
        setEmail('');
        setPassword('');
        setName('');
        setLastName('');
    };

    const handleSubmitLogin = async (event) => {
        event.preventDefault(); 
    
        try {
            const response = await fetch('http://localhost:3000/api/loginregister/logar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email_user, password_user }), 
            });
    
            if (!response.ok) {
                if (response.status === 401) {
                    alert("Email ou Senha Inválidos.");
                } else {
                    alert(`Erro ao fazer login. Código: ${response.status}`);
                }
                return;
            }
    
            const data = await response.json();
            alert('Login realizado com sucesso.');
            localStorage.setItem('token', data.token);
    
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert("Erro ao conectar-se ao servidor.");
        }
    };
    

    const handleSubmitRegister = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/loginregister/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email_user, password_user, name_user, lastname_user }), 
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.message === "Email já cadastrado.") {
                    alert("Este email já foi registrado. Tente outro.");
                } else {
                    alert("Erro ao registrar: " + data.message);
                }
                return;
            }

            alert('Conta registrada com sucesso.');
            toggleForm();
            setEmail('');
            setPassword('');
            setName('');
            setLastName('');

        } catch (error) {
            console.error('Erro ao registrar conta:', error);
            alert("Erro ao registrar conta. Detalhes: " + error.message);
        }    
    };


  return (
    <div className='login-register-container'>
        <main>
            {formVisibleLogin && (
            <form onSubmit={handleSubmitLogin}>
                <h2>Login</h2>
                <div className='input-label'>
                    <label htmlFor="email-login">Email</label>
                    <input type="email" id="email-login" placeholder="Digite seu Email" value={email_user} onChange={(e) => setEmail(e.target.value)} required autoComplete="email-login" />
                </div>
                <div className='input-label'>
                    <label htmlFor="password-login">Senha</label>
                    <input type="password" id="password-login" placeholder="Digite sua Senha" value={password_user} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                </div>
                <div className='span-button'>
                    <span>Ainda não possui uma conta?</span>
                    <button className='button-toggleform' onClick={toggleForm} type='button'>Registrar-se</button>
                </div>
                <button className='button-submit' type="submit">Entrar</button>
            </form>
            )}

            {formVisibleRegister && (
            <form onSubmit={handleSubmitRegister}>
                <h2>Registrar-se</h2>
                <div className='input-label'>
                    <label htmlFor="name">Nome</label>
                    <input type="text" id="name" placeholder="Digite seu Nome" value={name_user} onChange={(e) => setName(e.target.value)} required autoComplete="given-name" />
                </div>
                <div className='input-label'>
                    <label htmlFor="last-name">Sobrenome</label>
                    <input type="text" id="last-name" placeholder="Digite seu Sobrenome" value={lastname_user} onChange={(e) => setLastName(e.target.value)} required autoComplete="family-name" />
                </div>
                <div className='input-label'>
                    <label htmlFor="email-register">Email</label>
                    <input type="email" id="email-register" placeholder="Digite seu Email" value={email_user} onChange={(e) => setEmail(e.target.value)} required autoComplete="email-register" />
                </div>
                <div className='input-label'>
                    <label htmlFor="password-register">Senha</label>
                    <input type="password" id="password-register" placeholder="Digite sua Senha" value={password_user} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
                </div>
                <div className='span-button'>
                    <span>Já possui uma conta?</span>
                    <button className='button-toggleform' onClick={toggleForm} type='button'>Login</button>
                </div>
                <button className='button-submit' type="submit">Registrar-se</button>
            </form>
            )}
        </main>
    </div>
  )
}

export default LoginRegister