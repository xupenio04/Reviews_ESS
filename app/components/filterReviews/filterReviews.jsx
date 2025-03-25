'use client';

import FilterButtons from './filterButtons/filterButtons'
import PostNotFound from './postNotFound/postNotFound'
import './filterReviews.css'

import { useState } from "react";

export default function FilterReviews() {
    const [selectedMovies, setSelectedMovies] = useState(null)

    return (
        <div id='container'>
            <div id='filtro'>
                <FilterButtons selectedMovies = {selectedMovies} setSelectedMovies={setSelectedMovies}/>
            </div>
            {Array.isArray(selectedMovies) && selectedMovies.length === 0 && <PostNotFound />}
        </div>
    );
}
  