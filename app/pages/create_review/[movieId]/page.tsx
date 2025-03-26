"use client";
import Button from "../../../components/button/Button";
import StarButton from "../../../components/star_button/star_button";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import "./style.css"

export default function CreateReview() {
  const { movieId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movie, setMovie] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [textBody, setTextBody] = useState('');
  const [rating, setRating] = useState(0);
  const router = useRouter();
    const handleClick = async () => {

    }
  const handleConfirm = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      if (!textTitle.trim()) {
        alert('Por favor, digite o título da review!');
        return;
      }
      const response = await fetch(`http://localhost:5001/reviews/add`,  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({title: textTitle, body: textBody, classification: rating, movie: movieId}) 
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar o review: ${response.status}`);
      }

    
      alert('Review enviada com sucesso!');
      setTimeout(() => setIsMessageVisible(false), 5000);
      setTextTitle('');
      setTextBody(''); 
      router.replace('/pages/initial_page');
    } catch (err) {
      setError(err.message);
      console.error('Erro ao enviar:', err);
    }
  };
  
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:5001/movies/getId/${movieId}`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar filme: ${response.status}`);
        }
        const data = await response.json();
        setMovie(data.movie);
        setTextTitle('');
        setTextBody(''); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div className="vertical-right">
      <div>
      <div>
        <div className="horizontal"> 

          <div className="mr-4"> 
            <img
              src={movie.cover.imageURL}
              alt="Foto do post"
              className="photo_img"
            />
          </div>
         <div className="var-vertical">

            <div className="vertical-left">
                <div className="var-horizontal">
                    <div>
                        <h1 className="h1">{movie.name}</h1>
                        <h2 className="h2">{movie.genre}</h2>
                    </div> 
                    <StarButton rating={rating} setRating={setRating} />
                    
                </div>
                <div>
                <textarea 
                    className="title-textarea" 
                    placeholder="Digite o título da sua review aqui..." 
                    value={textTitle} 
                    data-testid="title-textarea"
                    onChange={(e) => setTextTitle(e.target.value)} 
                    />

                <textarea 
                    className="body-textarea" 
                    placeholder="Digite sua opinião aqui..." 
                    value={textBody} 
                    data-testid="body-textarea"
                    onChange={(e) => setTextBody(e.target.value)} 
                    />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div data-testid="confirm">
          <Button label="Postar" onClick={handleConfirm} />
    </div>
    </div>
  );
}