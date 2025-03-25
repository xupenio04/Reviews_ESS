'use client';

import { useEffect, useState } from "react";

import './filterButtons.css';

export default function FilterReviews({ selectedMovies, setSelectedMovies }) {
    const [isOpenMovie, setIsOpenMovie] = useState(false);
    const [isOpenClassification, setIsOpenClassification] = useState(false);
    const [isOpenGenre, setIsOpenGenre] = useState(false);

    const [selectedFilterItem, setSelectedItem] = useState(null);
    const [selectedItemTitle, setSelectedItemTitle] = useState(null);
    const [selectedItemGenre, setSelectedItemGenre] = useState(null);
    const [selectedItemClassification, setSelectedItemClassification] = useState(null);

    const [itemTitles, setItemTitles] = useState(undefined);
    const [itemClassification, setItemClassification] = useState(undefined);
    const [itemGenre, setItemGenre] = useState(undefined);

    //const [selectedMovies, setSelectedMovies] = useState(null);
    
    const ClickMovie = () => {
        setIsOpenMovie(!isOpenMovie);
    };

    const ClickClassification = () => {
        setIsOpenClassification(!isOpenClassification);
    };
    const ClickGenre = () => {
        setIsOpenGenre(!isOpenGenre);
    };

    const deleteFilter = () => {
        setSelectedItem(null);
        setSelectedMovies(null)
        setSelectedItemTitle(null);
        setSelectedItemGenre(null);
        setSelectedItemClassification(null);
    };

    const handleSelect = (item, idx) => {
        if (idx === 0) {
            setSelectedItemTitle(item);
            setSelectedItemGenre(null); // Resetando as outras variáveis
            setSelectedItemClassification(null);
        }
        if (idx === 1) {
            setSelectedItemTitle(null); // Resetando as outras variáveis
            setSelectedItemGenre(item);
            setSelectedItemClassification(null);
        }
        if (idx === 2) {
            setSelectedItemTitle(null); // Resetando as outras variáveis
            setSelectedItemGenre(null);
            setSelectedItemClassification(item);
        }
        setSelectedItem(item);
        setIsOpenMovie(false); 
        setIsOpenClassification(false);
        setIsOpenGenre(false) // Fecha todos os dropdowns ao selecionar
    };

    useEffect(() => {
        async function getMovies (){
            setItemTitles([]);
            setItemClassification([]);
            setItemGenre([]);

            const response = await fetch("http://localhost:5001/movies/", {
                method: "GET",
                headers: {
                "Content-Type": "application/json"
                },
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const movies = await response.json();

            const titles = movies.map(movie => movie.name).sort((a, b) => a.localeCompare(b));
            const genre = [...new Set(movies.filter(movie => movie.genre && movie.genre !== "default").map(movie => movie.genre))];
            const classification = ["0", "1", "2", "3", "4", "5"]

            setItemTitles(titles)
            setItemClassification(classification)
            setItemGenre(genre)
        }
        
        getMovies()
    },[])
        
    useEffect(() => {
        async function getReviews(){
            const requestBody = {};
        
            if (selectedItemTitle) requestBody.title = selectedItemTitle;
            if (selectedItemGenre) requestBody.genre = selectedItemGenre;
            if (selectedItemClassification) requestBody.classification = selectedItemClassification;

            console.log([selectedItemTitle, selectedItemGenre, selectedItemClassification])
            if (Object.keys(requestBody).length === 0) {
                return; // Checa se os valores realmente foram adicionados
            }

            try {
                const response = await fetch("http://localhost:5001/reviews/filter", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestBody)
                });
    
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status}`);
                }
    
                const data = await response.json();
                const reviews = data.review;
                setSelectedMovies(reviews);
                console.log(reviews);
            } catch (error) {
                console.error("Erro ao buscar reviews:", error);
            }
        }
        getReviews();
    }, [selectedItemTitle, selectedItemGenre, selectedItemClassification])


    return (
        <div id="general">
            <div id="filter">
                <div id='header'>
                    <div id='titulo'>Filtrar por </div>
                </div>
                <div id = "filtros">
                    <div id='filterContainer' onMouseEnter={ClickMovie} onMouseLeave={ClickMovie}>
                        <button id="movieButton">
                            Filme
                        </button>
                        {isOpenMovie && (
                            <ul className="dropdown">
                                {itemTitles.length > 0 ? (
                                    itemTitles.map((item, index) => (
                                        <li key={index} onClick={() => handleSelect(item,0)}>
                                            {item}
                                        </li>
                                    ))
                                    ) : (
                                        <li>Carregando...</li>  // Exibe enquanto os itens estão sendo carregados
                                    )
                                }
                            </ul>
                        )}
                    </div>
                    <div id='filterContainer' onMouseEnter={ClickGenre} onMouseLeave={ClickGenre}>
                        <button id = 'genreButton'>
                            Gênero
                        </button>
                        {isOpenGenre && (
                            <ul className="dropdown">
                                {itemGenre.length > 0 ? (
                                    itemGenre.map((item, index) => (
                                        <li key={index} onClick={() => handleSelect(item,1)}>
                                            {item}
                                        </li>
                                    ))
                                    ) : (
                                        <li>Carregando...</li>  // Exibe enquanto os itens estão sendo carregados
                                    )
                                }
                            </ul>
                        )}
                    </div>
                    
                    <div id='filterContainer' onMouseEnter={ClickClassification} onMouseLeave={ClickClassification}>
                        <button id = 'classificationButton'>
                            Classificação
                        </button>
                        {isOpenClassification && (
                            <ul className="dropdown">
                                {itemClassification.length > 0 ? (
                                    itemClassification.map((item, index) => (
                                        <li key={index} onClick={() => handleSelect(item,2)}>
                                            {item}
                                        </li>
                                    ))
                                    ) : (
                                        <li>Carregando...</li>  // Exibe enquanto os itens estão sendo carregados
                                    )
                                }
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            {selectedFilterItem && (
                <div id='appliedFilter'>
                    <div id="svg_container">
                        <svg id="svgoff" width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.25 6.45654L6.75 19.3696M6.75 6.45654L20.25 19.3696" stroke="white" strokeWidth="2.34783" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <svg id= "svgon" onClick={deleteFilter} width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.25 6.45654L6.75 19.3696M6.75 6.45654L20.25 19.3696" stroke="#FFD11A" strokeWidth="2.34783" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    {selectedFilterItem}
                </div>
            )}
        </div>
    );
}