'use client';


import {useRouter} from 'next/navigation'
import ShowMovies from '../../components/showMovies/showMovies'

import './style.css'

export default function Home() {
    const router = useRouter()

    const handleClickCadastrar = () => {
        router.push('/pages/addMovie'); // Navega para a página de cadastro
    };
    return (
        <div id='home'>
            <div id="header-bar">
                <div id="searchBar">
                    <input type="text" placeholder="Buscar filme..." id="searchInput" />
                    <button id="searchButton">🔍</button>
                </div>
            </div>
            <ShowMovies/>
            <button id='cadastrar' onClick={handleClickCadastrar}>
                Cadastrar
            </button>
        </div>
    );
}
  