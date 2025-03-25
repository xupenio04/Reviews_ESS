'use client';

import './showMovies.css'
import ImageCard from './imageCard/imageCard'

import { useEffect, useState } from "react";

export default function FilterReviews() {
    const [movies, setMovies] = useState(null)
    const [movieTitleCover, setMovieTitleCover] = useState([])

    useEffect(() => {
            async function getMovies (){
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
    
                const orderedMovies = movies.sort((a, b) => a.name.localeCompare(b.name));
                const listImageTitle = orderedMovies.map(movie => ({
                    name: movie.name, 
                    coverURL: movie.cover.imageURL
                }));
                setMovieTitleCover(listImageTitle)
            }
            getMovies()
        },[])

    return (
        <div id = 'container'>
            <div id='grid-container'>
            {movieTitleCover && movieTitleCover.map((item, index) => (
                <div key={index} id='grid-item'>
                    <ImageCard imageURL={item.coverURL} title={item.name}/>
                </div>
            ))}
            </div>
        </div>
    );
}