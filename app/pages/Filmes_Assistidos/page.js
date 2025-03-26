'use client';
import Sidebar from '../../components/sidebar/sidebar';
import SearchBar from '../../components/searchbar/searchbar';
import MovieInfo from '../../components/filme_info/movie_info';
import TopBar from '../../components/topbar/topbar';
import PopUpAdicao from '../../components/popUp_adicao/popUp_adicao';
import PopUpRemocao from '../../components/popUp_remocao/popUp_remocao';
import { use, useEffect, useState } from 'react';
import './style.css';

export default function Home() {
    const [IsAddButton, SetIsAddButton] = useState(false);
    const [IsRemoveButton, SetIsRemoveButton] = useState(false);
    const [IsWatched, SetIsWatched] = useState(true); 
    const [IsAbandoned, SetIsAbandoned] = useState(false);
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [IsSearch, setIsSearch] = useState(false);
    const [userName, setUserName] = useState('Carregando...');


    /*
    useEffect(() => {
        fetchUserData();
        console.log(userName);
        async function fetchMovies() {
            
            fetchUserData();

            const watchedResponse = await fetch(`http://localhost:5001/users/${userName}/watched`);
            const abandonedResponse = await fetch(`http://localhost:5001/users/${userName}/abandoned`);

            const watchedMovies = await watchedResponse.json();
            const abandonedMovies = await abandonedResponse.json();

            setMovies([
                ...watchedMovies.map(m => ({ ...m, type: "watched" })),
                ...abandonedMovies.map(m => ({ ...m, type: "abandoned" }))
            ]);

           
            setFilteredMovies(watchedMovies.map(m => ({ ...m, type: "watched" })));
        }

        fetchMovies();
    }, []);
    */

    useEffect(() => {
        if (IsWatched) {
            setFilteredMovies(movies.filter(movie => movie.type === "watched"));
        } else if (IsAbandoned) {
            setFilteredMovies(movies.filter(movie => movie.type === "abandoned"));
        }

    }, [IsWatched, IsAbandoned, movies]);


    const handleSearch = (searchValue) => {
        setSearchTerm(searchValue); 

        if (!searchValue) {
            if (IsWatched) {
                setFilteredMovies(movies.filter(movie => movie.type === "watched"));
            } else if (IsAbandoned) {
                setFilteredMovies(movies.filter(movie => movie.type === "abandoned"));
            }
            return;
        }

        const filtered = movies.filter(movie =>
            movie.title.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredMovies(filtered);
    };
    return (
        <div id='home'>
            <TopBar
                SetIsAddButton={SetIsAddButton}
                SetIsRemoveButton={SetIsRemoveButton}
                SetIsWatched={SetIsWatched}
                SetIsAbandoned= {SetIsAbandoned}
                onSearch={handleSearch}
            />

            {IsAddButton && (
                <div className='container'>
                    <PopUpAdicao SetIsAddButton={SetIsAddButton} />
                </div>
            )}

            {IsRemoveButton && (
                <div className='container'>
                    <PopUpRemocao SetIsRemoveButton={SetIsRemoveButton} />
                </div>
            )}

            <MovieInfo IsWatched={IsWatched} IsAbandoned={IsAbandoned}
                movies={filteredMovies}
                listType={IsWatched ? 'watched' : 'abandoned'}
            />
        </div>
    );
}