'use client';

import { useState, useEffect } from 'react';
import './review_rectangle.css';

export default function RetanguloCinza({movieId}) {
  const [reviews, setReviews] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cover, setCover] = useState({}); // Objeto da capa
  const [movieDetails, setMovieDetails] = useState({ name: "", synopsis: "" }); // Para armazenar name e sinopse

  //const movieId = "67dad4119429a2af3f58ddc9"; // ID do filme
  console.log(movieId)
  const fetchReviews = async (id) => {
    try {

      //console.log(id)
      const response = await fetch(`http://localhost:5001/reviews/getMovie/${id}`);
      if (!response.ok) throw new Error('Falha ao buscar reviews');
      
      const data = await response.json();
      setReviews(data);

      const userRequests = data.map(async (review) => {
        const userResponse = await fetch(`http://localhost:5001/users/${review.owner}`);
        if (!userResponse.ok) return { id: review.owner, name: "Usuário desconhecido" };
        const userData = await userResponse.json();
        return { id: review.owner, name: userData.name };
      });

      const users = await Promise.all(userRequests);
      const usersMap = users.reduce((acc, user) => {
        acc[user.id] = user.name;
        return acc;
      }, {});

      setUsernames(usersMap);

      // Buscando o filme para pegar a capa, name e sinopse
      const movieResponse = await fetch(`http://localhost:5001/movies/${id}`);
      if (!movieResponse.ok) throw new Error('Falha ao buscar a capa do filme');
      const movieData = await movieResponse.json();
      setCover(movieData.cover); // Armazenando o objeto da capa
      // Atualize para usar movieData.name
      setMovieDetails({ name: movieData.name, synopsis: movieData.synopsis });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchReviews(movieId);
    }
  }, [movieId]); // escutamos mudanças no movieId

if (loading) return <div>Carregando...</div>;
if (error) return <div>Erro: {error}</div>;

return (
    <div>

        <div id="top-bar">
            {/* Retângulo branco com o input */}
            <div id="search-container">
                <div id="search-box">
                    <input type="text" id="search-input" placeholder="Pesquisar" />
                    {/* O SVG ficará aqui ao lado do campo de entrada */}
                    <div id="search-icon">
                        <svg id='lupa' version="1.0" xmlns="http://www.w3.org/2000/svg"
                            width="32px" height="32px" viewBox="0 0 512.000000 512.000000"
                            preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                fill="#F9A826" stroke="none">
                                <path d="M2085 4474 c-709 -76 -1277 -596 -1417 -1297 -32 -161 -32 -433 0
                                -594 130 -650 619 -1140 1272 -1274 161 -33 433 -34 595 -1 242 48 455 141
                                644 280 l74 54 496 -495 c436 -436 501 -496 534 -502 60 -11 107 3 148 44 41
                                41 55 88 44 149 -6 32 -66 97 -501 533 l-495 496 56 79 c142 198 229 398 277
                                639 32 158 32 432 0 592 -129 648 -623 1144 -1267 1273 -98 20 -368 34 -460
                                24z m425 -343 c251 -57 446 -165 631 -350 186 -185 300 -394 355 -651 26 -119
                                26 -381 0 -500 -55 -257 -169 -466 -355 -651 -185 -186 -394 -299 -651 -355
                                -126 -27 -392 -25 -516 4 -259 61 -452 167 -635 351 -186 185 -300 394 -355
                                651 -26 119 -26 381 0 500 56 259 167 462 355 651 182 183 383 294 630 349
                                121 26 148 29 311 24 95 -2 174 -10 230 -23z"/>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <div id="conteiner">
            <div id="movie-cover-container">
                <div id="movie-cover">
                    {cover.imageURL && (
                    <img src={cover.imageURL || 'https://via.placeholder.com/150'} alt="Cover do filme" />
                    )}
                </div>
                <div id="movie-info">
                    <h2 className="movie-title">{movieDetails.name}</h2>
                    <h3 className="synopsis-label">Sinopse</h3>
                    <p className="movie-synopsis">{movieDetails.synopsis}</p>
                </div>
            </div>

            <div id="reviews-container">
              <h2 className="reviews-title">Reviews</h2>
              {reviews.length === 0 ? (
                  <p className="no-reviews">Nenhuma review encontrada para este filme.</p>
                  ) : (
                  reviews.map((review) => (
                      <div key={review._id} id="rectangle">
                          <div id="titulo_review">
                              <h2>{review.title}</h2>
                              <h3>por: {usernames[review.owner] || "Carregando..."}</h3>
                          </div>
                          <div id="corpo_review">
                              <p>{review.body}</p>
                          </div>
                      </div>
                  ))
              )}
          </div>
        </div>
    </div>
  );
}
