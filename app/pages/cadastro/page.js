'use client';

import './style.css'
import Sidebar from '../../components/sidebar/sidebar'
import FormCadastro from '../../components/form_cadastro/form_cadastro'
import FormLogin from '../../components/form_login/form_login'
import { useEffect, useState } from 'react'

export default function Home() {
    const [isLogin, setIsLogin] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [formContainer, setFormContainer] = useState(null);

    useEffect(() => {
        setFormContainer(document.getElementById('content'));
    });
    
    if(isLogin) {
        formContainer.classList.add('move-to-left');
        setTimeout(() => {
            setIsTransitioning(true);
        }, 175);
    }
    else if (formContainer && formContainer.classList) {
        formContainer.classList.remove('move-to-left');
        setTimeout(() => {
            setIsTransitioning(false);
        }, 175);
    }

    return (
        <div id='home'>
            <Sidebar id='sidebar' isLogin={isLogin} setIsLogin={setIsLogin} />
            <div id='content' data-testid="form-container">
                {!isTransitioning ? (<FormCadastro />) : (<FormLogin />)}
            </div>
        </div>
    );
}
  