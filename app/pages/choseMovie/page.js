'use client';


import {useRouter} from 'next/navigation'
import ShowMovies from '../../components/showChoseMovie/showChoseMovie'

import './style.css'

export default function Home() {
    const router = useRouter()

    return (
        <div id='home'>
            <div id="header-bar">
                <div id="searchBar">
                    <input type="text" placeholder="Buscar filme..." id="searchInput" />
                    <button id="searchButton">🔍</button>
                </div>
            </div>
            <ShowMovies/>
        </div>
    );
}
  