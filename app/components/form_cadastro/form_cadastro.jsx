'use client'; // Diretriz para o Next.js marcar este arquivo como um componente cliente

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './form_cadastro.css';

export default function FormCadastro() {
    const [showSvgName, setShowSvgName] = useState(false);
    const [showSvgEmail, setShowSvgEmail] = useState(false);
    const [showSvgPassword, setShowSvgPassword] = useState(false);
    const [showSvgConfirm, setShowSvgConfirm] = useState(false);
    const [errorMessage, setErrorMessage] = useState('a');
    const [userName, setuserName] = useState(null);
    const router = useRouter();

    const svgCode_name = `
        <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.5 41C31.8218 41 41 31.8218 41 20.5C41 9.17816 31.8218 0 20.5 0C9.17816 0 0 9.17816 0 20.5C0 31.8218 9.17816 41 20.5 41Z" fill="#FD0808"/>
            <path d="M23.451 33C24.4342 33 25.2313 32.2029 25.2313 31.2197C25.2313 30.2365 24.4342 29.4394 23.451 29.4394C22.4677 29.4394 21.6707 30.2365 21.6707 31.2197C21.6707 32.2029 22.4677 33 23.451 33Z" fill="white"/>
            <path d="M23.4434 9.22762C23.2799 10.3143 23.5729 10.5417 23.5745 15.2265C23.5761 19.9114 24.5482 26.1926 23.4493 26.1929C22.3504 26.1933 21.9485 13.2303 18.1326 12.083C13.6461 10.7341 23.9728 5.70983 23.4434 9.22762Z" fill="white"/>
        </svg>
    `;

    const svgCode_email = svgCode_name;
    const svgCode_password = svgCode_name;
    const svgCode_confirm = svgCode_name;

    useEffect(() => {
        const name = document.getElementById('nome');
        const email = document.getElementById('e-mail');
        const senha = document.getElementById('password');
        const confirmaSenha = document.getElementById('confirm-password');
        const btnEnviar = document.getElementById('ent');
        const message = document.getElementById('message');
        const form = document.getElementById('form');

        function verificarSenhas() {
            if (senha.value === confirmaSenha.value && senha.value !== "") {
                if(name.value !== "" && email.value !== "") {
                    btnEnviar.disabled = false; 
                }
                else {
                    btnEnviar.disabled = true; 
                }
                setShowSvgConfirm(false);
                setErrorMessage('a');
                message.style.color = 'transparent';
            } else {
                btnEnviar.disabled = true;
            }

            if (senha.value !== confirmaSenha.value && confirmaSenha.value !== "") {
                confirmaSenha.style.border = '2px solid #FD0808';
                setShowSvgConfirm(true);
                setErrorMessage('A confirmação de senha não confere!');
                message.style.color = '#FD0808'
            } else {
                confirmaSenha.style.border = '';
            }
        }

        async function enviar (event) {
            event.preventDefault();
            const name = document.getElementById('nome').value;
            const email = document.getElementById('e-mail').value;
            const password = document.getElementById('password').value;

            const response = await fetch("http://localhost:5001/users/add", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            const mensagem = data.message + '!';
            
            setErrorMessage(mensagem);
            setShowSvgName(false);
            setShowSvgEmail(false);
            setShowSvgPassword(false);
            setuserName(data);

            document.getElementById('nome').style.border = '';
            document.getElementById('e-mail').style.border = '';
            document.getElementById('password').style.border = '';
            
            if (response.ok) {
                message.style.color = 'green';

                const responseLogin = await fetch('http://localhost:5001/users/login', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });
                const dataUser = await responseLogin.json();

                localStorage.setItem('userName', JSON.stringify(dataUser));
                localStorage.setItem('user', JSON.stringify(dataUser.user));
                localStorage.setItem('userToken', JSON.stringify(dataUser.token));
                console.log(dataUser)
                router.push('/pages/initial_page'); // Redireciona para a tela inicial
            } else {
                if (mensagem === 'Username já cadastrado!') {
                    setShowSvgName(true);
                    document.getElementById('nome').style.border = '2px solid #FD0808';
                }
                else if (mensagem === 'Email já cadastrado!') {
                    setShowSvgEmail(true);
                    document.getElementById('e-mail').style.border = '2px solid #FD0808';
                }
                else if (mensagem === 'A senha deve ter pelo menos 8 caracteres!') {
                    setShowSvgPassword(true);
                    document.getElementById('password').style.border = '2px solid #FD0808';
                }
                message.style.color = '#FD0808';
            }
        }

        name.addEventListener('input', verificarSenhas);
        email.addEventListener('input', verificarSenhas);
        senha.addEventListener('input', verificarSenhas);
        confirmaSenha.addEventListener('input', verificarSenhas);
        form.addEventListener('submit', enviar);

        return () => {
            name.removeEventListener('input', verificarSenhas);
            email.removeEventListener('input', verificarSenhas);
            senha.removeEventListener('input', verificarSenhas);
            confirmaSenha.removeEventListener('input', verificarSenhas);
            form.removeEventListener('submit', enviar);
        };
    }, []);

    return (
        <div id="container">
            <div id="title">
                <h1>CADASTRO</h1>
            </div>
            <div id="enter">
                <form id="form">
                    <div className="nome">
                        <label htmlFor="nome" className="label">nome de usuário</label>
                        <input type="text" name="nome" id="nome" placeholder="" required />
                        {showSvgName && <div id='name-incorrect' dangerouslySetInnerHTML={{ __html: svgCode_name }} />}
                    </div>

                    <div className="email">
                        <label htmlFor="e-mail" className="label">e-mail</label>
                        <input type="text" name="e-mail" id="e-mail" placeholder="" required />
                        {showSvgEmail && <div id='email-incorrect' dangerouslySetInnerHTML={{ __html: svgCode_email }} />}
                    </div>

                    <div className="senha">
                        <label htmlFor="password" className="label">senha</label>
                        <input type="password" name="password" id="password" placeholder="" required />
                        {showSvgPassword && <div id='password-incorrect' dangerouslySetInnerHTML={{ __html: svgCode_password }} />}
                    </div>

                    <div className="confirm-senha">
                        <label htmlFor="confirm-password" className="label">confirme sua senha</label>
                        <input type="password" name="confirm-password" id="confirm-password" placeholder="" required />
                        {showSvgConfirm && <div id='confirm-incorrect' dangerouslySetInnerHTML={{ __html: svgCode_confirm }} />}
                    </div>
                    <p id='message' className="error-message">{errorMessage}</p>
                    <button id="ent" disabled>CRIAR CONTA</button>
                </form>
            </div>
        </div>
    );
}