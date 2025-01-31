import { useState } from 'react'
import './LoginRegister.css'

const LoginRegister = () => {

    const [formVisibleRegister, setformVisibleRegister] = useState(false);
    const [formVisibleLogin, setformVisibleLogin] = useState(true);

    const toggleForm = (event) => {
        event.preventDefault();
        setformVisibleRegister(!formVisibleRegister);
        setformVisibleLogin(!formVisibleLogin);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); 
    };

  return (
    <div>
        <main>
            {formVisibleLogin && (
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className='input-label'>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Digite seu Email" />
                </div>
                <div className='input-label'>
                    <label htmlFor="password">Senha</label>
                    <input type="password" id="password" placeholder="Digite sua Senha" />
                </div>
                <div className='span-button'>
                    <span>Ainda não possui uma conta?</span>
                    <button className='button-toggleform' onClick={toggleForm}>Registrar-se</button>
                </div>
                <button className='button-submit' type="submit">Entrar</button>
            </form>
            )}

            {formVisibleRegister && (
            <form onSubmit={handleSubmit}>
                <h2>Registrar-se</h2>
                <div className='input-label'>
                    <label htmlFor="name">Nome</label>
                    <input type="text" id="name" placeholder="Digite seu Nome" />
                </div>
                <div className='input-label'>
                    <label htmlFor="last-name">Sobrenome</label>
                    <input type="text" id="last-name" placeholder="Digite seu Sobrenome" />
                </div>
                <div className='input-label'>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Digite seu Email" />
                </div>
                <div className='input-label'>
                    <label htmlFor="password">Senha</label>
                    <input type="password" id="password" placeholder="Digite sua Senha" />
                </div>
                <div className='span-button'>
                    <span>Já possui uma conta?</span>
                    <button className='button-toggleform' onClick={toggleForm}>Login</button>
                </div>
                <button className='button-submit' type="submit">Registrar-se</button>
            </form>
            )}
        </main>
    </div>
  )
}

export default LoginRegister