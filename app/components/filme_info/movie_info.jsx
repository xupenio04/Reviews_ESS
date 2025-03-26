import { useEffect, useState } from 'react';
import './movie_info.css';

export default function MovieInfo({ IsWatched, IsAbandoned, IsSearch }) {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [detailedWatchedMovies, setDetailedWatchedMovies] = useState([]);
  const [abandonedMovies, setAbandonedMovies] = useState([]);
  const [detailedAbandonedMovies, setDetailedAbandonedMovies] = useState([]);
  const [detailedCombinedMovies, setDetailedCombinedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Carregando...');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const handleBack = () => {
    window.location.href= '/pages/page_userProfile';
  };

  const handleSearch = async (searchQuery) => {
    if (searchQuery.trim() === "") {
      setUserData(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/users/find/${searchQuery}`);
      if (response.status === 200) {
        const data = await response.json();
        setUserData(data);
        setError(null);
      } else {
        setUserData(null);
        setError("Usuário não encontrado");
      }
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      setUserData(null);
      setError("Erro ao conectar ao servidor.");
    }
  };


  const fetchUserData = async () => {
    try {
        const storedName = localStorage.getItem('userName');
        if (!storedName) {
            console.error("Nome de usuário não encontrado no localStorage.");
            return;
        }

        const data = JSON.parse(storedName);
        if (!data || !data.user || !data.user.name) {
            console.error("Dados inválidos encontrados no localStorage.");
            return;
        }
        
        const username = data.user.name;
        setUserName(username); 
        fetchWatchedList(username);
        fetchAbandonedList(username);
    } catch (error) {
        console.error("Erro ao recuperar dados do usuário:", error.message);
    }
};


  // Função para buscar a lista de filmes assistidos
  const fetchWatchedList = async (name) => {
    try {
      const response = await fetch(`http://localhost:5001/users/${name}/watched`);
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Erro na resposta da API:", response.status, errorDetails);
        throw new Error(`Erro ao buscar lista de assistidos. Status: ${response.status}`);
      }
      
      const watchedList = await response.json();
      console.log('Lista de filmes assistidos:', watchedList);
      setWatchedMovies(watchedList);
    } catch (error) {
      console.error("Erro ao buscar lista de assistidos:", error.message);
    }
  };

  const fetchAbandonedList = async (name) => {
    try {
      const response = await fetch(`http://localhost:5001/users/${name}/abandoned`);
      
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Erro na resposta da API:", response.status, errorDetails);
        throw new Error(`Erro ao buscar lista de abandonados. Status: ${response.status}`);
      }
      
      const abandonedList = await response.json();
      console.log('Lista de filmes abandonados:', abandonedList);
      setAbandonedMovies(abandonedList);
    } catch (error) {
      console.error("Erro ao buscar lista de abandonados:", error.message);
    }
  };


  const fetchMovieDetails = async (movieName) => {
    try {
      const response = await fetch('http://localhost:5001/movies/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: movieName }),
      });

      if (!response.ok) {
        console.error(`Erro ao buscar detalhes do filme "${movieName}":`, response.status);
        return null;
      }

      const data = await response.json();
      return data.movie || null;
    } catch (error) {
      console.error(`Erro ao buscar detalhes do filme "${movieName}":`, error.message);
      return null;
    }
  };

  // Função genérica para buscar detalhes dos filmes
  const fetchMoviesDetails = async (movies, setDetailedMovies) => {
    if (movies.length === 0) return;

    const moviesDetails = await Promise.all(
      movies.map(async (movie) => {
        const details = await fetchMovieDetails(movie.title);
        return details ? { ...details, avaliation: movie.avaliation } : null;
      })
    );

    setDetailedMovies(moviesDetails.filter(movie => movie !== null));
  };

  useEffect(() => {
  
  fetchUserData();
  
  }, []);


  useEffect(() => {
    fetchMoviesDetails(watchedMovies, setDetailedWatchedMovies);
  }, [watchedMovies]);

  useEffect(() => {
    fetchMoviesDetails(abandonedMovies, setDetailedAbandonedMovies);
  }, [abandonedMovies]);


  useEffect(() => {
    if (detailedWatchedMovies.length > 0 || detailedAbandonedMovies.length > 0 || detailedCombinedMovies.length > 0) {
      setLoading(false);
    }
  }, [detailedWatchedMovies, detailedAbandonedMovies, detailedCombinedMovies]);

  const noMoviesFound = detailedWatchedMovies.length === 0 && detailedAbandonedMovies.length === 0;

  return (
    <div id='movieInfo'>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {noMoviesFound ? (
            <p>Nenhum filme encontrado.</p>
          ) : (
            <>
              {IsWatched && (
                <div className="typeListContainer">
                  <button className="backButton" onClick={handleBack}>Voltar</button>
                  <h2 className='TypeList'>Filmes Assistidos</h2>
                </div>
              )}
              {detailedWatchedMovies.length > 0 ? (
                IsWatched && detailedWatchedMovies.map((movie, index) => (
                  <div key={index} className="movieItem">
                    <img className="movieCover" src={movie.cover?.imageURL || 'https://via.placeholder.com/150'} alt={movie.name} />
                    <div className="movieDetails">
                      <h2 className="movieTitle">{movie.name}</h2>
                      <p className="movieGenre">
                        Gênero: <span className="genreHighlight">{movie.genre || "Desconhecido"}</span>
                      </p>
                      <div className='movieDownInfos'>
                        <p className="movieSynopsis">Sinopse: {movie.synopsis || "Sinopse não disponível."}</p>
                        <p className="movieAvaliation">Avaliação: {movie.avaliation || "Sem avaliação."}</p>
                      </div>
                    </div>
                    <div className="movieStars">
                      {Array.from({ length: Math.ceil(movie.avg / 2) }).map((_, i) => (
                        <svg
                          key={i}
                          width="24"
                          height="24"
                          viewBox="0 0 48 46"
                          fill="#F9A826"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M24 0L29.6129 17.2746H47.7764L33.0818 27.9508L38.6946 45.2254L24 34.5491L9.30537 45.2254L14.9182 27.9508L0.223587 17.2746H18.3871L24 0Z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                IsWatched && <p>Nenhum filme assistido encontrado.</p>
              )}

              {IsAbandoned && (
                <div className="typeListContainer">
                  <button className="backButton" onClick={handleBack}>Voltar</button>
                  <h2 className='TypeList'>Filmes Abandonados</h2>
                </div>
              )}
              {detailedAbandonedMovies.length > 0 ? (
                IsAbandoned && detailedAbandonedMovies.map((movie, index) => (
                  <div key={index} className="movieItem">
                    <img className="movieCover" src={movie.cover?.imageURL || 'https://via.placeholder.com/150'} alt={movie.name} />
                    <div className="movieDetails">
                      <h2 className="movieTitle">{movie.name}</h2>
                      <p className="movieGenre">
                        Gênero: <span className="genreHighlight">{movie.genre || "Desconhecido"}</span>
                      </p>
                      <div className='movieDownInfos'>
                        <p className="movieSynopsis">Sinopse: {movie.synopsis || "Sinopse não disponível."}</p>
                        <p className="movieAvaliation">Avaliação: {movie.avaliation || "Sem avaliação."}</p>
                      </div>
                    </div>
                    <div className="movieStars">
                      {Array.from({ length: Math.ceil(movie.avg) }).map((_, i) => (
                        <svg
                          key={i}
                          width="24"
                          height="24"
                          viewBox="0 0 48 46"
                          fill="#F9A826"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M24 0L29.6129 17.2746H47.7764L33.0818 27.9508L38.6946 45.2254L24 34.5491L9.30537 45.2254L14.9182 27.9508L0.223587 17.2746H18.3871L24 0Z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                IsAbandoned && <p>Nenhum filme abandonado encontrado.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}