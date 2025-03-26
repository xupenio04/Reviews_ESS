'use client'

import './style.css'
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReviewRectangle from '../../components/review_rectangle/review_rectangle'

export default function AparecerReviews() {
    const searchParams = useSearchParams();
    const [movieId, setMovieId] = useState(null);

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            console.log(id);
            setMovieId(id.toString());
        }
    }, [searchParams]);

    return (
        <div>
            <ReviewRectangle movieId={movieId}/>
        </div>
    )
}