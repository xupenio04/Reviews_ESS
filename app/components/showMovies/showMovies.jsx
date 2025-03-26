'use client';

import './showMovies.css'
import { useRouter } from 'next/navigation';
import ImageCard from './imageCard/imageCard'


import { useEffect, useState } from "react";

export default function FilterReviews() {
    const [accessedMovie, setAccessedMovie] = useState(null)
    const [movies, setMovies] = useState(null)
    const [movieTitleCover, setMovieTitleCover] = useState([])

    const router = useRouter();

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
                    id: movie._id,
                    name: movie.name, 
                    coverURL: movie.cover.imageURL
                }));
                setMovieTitleCover(listImageTitle)
            }
            getMovies()
        },[])

        const handleNavigate = (id) => {
            console.log(id)
            router.push(`/pages/movie_reviews?id=${id}`);
        }
    return (
        <div id = 'container'>
            <div id='grid-container'>
            {movieTitleCover && movieTitleCover.map((item, index) => (
                <div key={index} id='grid-item' onClick={()=>handleNavigate(item.id)}>
                    <ImageCard imageURL={item.coverURL} title={item.name} />
                </div>
            ))}
            </div>
        </div>
    );
}