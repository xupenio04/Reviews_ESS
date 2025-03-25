'use client';
import './popUp_adicao.css';
import { useEffect, useState } from 'react';

export default function PopUpAdicao({ SetIsAddButton }) {
  const [IsWatched, SetIsWatched] = useState(false);
  const [IsAbandoned, SetIsAbandoned] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Adicione esta linha
  const [userName, setUserName] = useState('Carregando...');

  useEffect(() => {
    const IsBackButton = document.getElementById('backButton');
    IsBackButton.addEventListener('click', () => SetIsAddButton(false));

    fetchUserData();

    return () => {
      IsBackButton.removeEventListener('click', () => SetIsAddButton(false));
    };
    
  }, []);


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

        const userName = data.user.name;
        console.log(userName);
        setUserName(userName); // Atualiza o estado do nome do usuário
        
    } catch (error) {
        console.error("Erro ao recuperar dados do usuário:", error.message);
    }
};


  async function sendInfos(event) {
    event.preventDefault();
    const titleFilme = document.getElementById('Title').value;
    const userAvaliation = document.getElementById('Avaliation').value;

    const response = JSON.stringify({ titleFilme, userAvaliation, watched: IsWatched, abandoned: IsAbandoned });
    const data = JSON.parse(response);


    try {
      // Busca a lista de filmes assistidos

      //const name =fetchUserData();

      //console.log(name);
      const watchedResponse = await fetch(`http://localhost:5001/users/${userName}/watched`);
      const watchedMovies = await watchedResponse.json();

      // Busca a lista de filmes abandonados
      const abandonedResponse = await fetch(`http://localhost:5001/users/${userName}/abandoned`);
      const abandonedMovies = await abandonedResponse.json();

      // Verifica se o filme já está em alguma lista
      const isMovieInWatched = watchedMovies.some(movie => movie.title === data.titleFilme);
      const isMovieInAbandoned = abandonedMovies.some(movie => movie.title === data.titleFilme);

      if (isMovieInWatched || isMovieInAbandoned) {
        setErrorMessage('Este filme já está na lista.');
        return; 
      }

      // Se o filme não estiver na lista, procede com a adição
      if (data.watched) {
        const request = {
          name: userName,
          title: data.titleFilme,
          avaliation: data.userAvaliation
        };

        const responseWatched = await fetch("http://localhost:5001/users/watched", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(request)
        });

        if (!responseWatched.ok) {
          throw new Error('Erro ao adicionar filme à lista de assistidos.');
        }
      } else if (data.abandoned) {
        const request = {
          name: userName,
          title: data.titleFilme,
          avaliation: data.userAvaliation
        };

        const responseAbandoned = await fetch("http://localhost:5001/users/abandoned", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(request)
        });

        if (!responseAbandoned.ok) {
          throw new Error('Erro ao adicionar filme à lista de abandonados.');
        }
      }

      // Limpa a mensagem de erro e fecha o pop-up
      setErrorMessage('');
      SetIsAddButton(false);
    } catch (error) {
      console.error('Erro ao adicionar filme:', error.message);
      setErrorMessage('Erro ao adicionar filme. Tente novamente.');
    }
  }

  return (
    <div id='PopUpAdicao'>
      <svg id='backButton' version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="50px" height="50px" viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet">
        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
          fill="#629584" stroke="none">
          <path d="M2380 4794 c-19 -2 -71 -9 -115 -15 -886 -118 -1625 -760 -1861
          -1616 -61 -225 -78 -349 -78 -598 -1 -248 12 -351 70 -573 96 -371 283 -704
          549 -980 350 -364 776 -585 1290 -669 152 -25 495 -24 650 1 481 77 890 279
          1228 605 360 348 586 788 664 1291 24 159 24 481 0 640 -78 503 -304 943 -664
          1291 -335 323 -727 519 -1198 600 -115 19 -444 34 -535 23z m355 -324 c463
          -44 895 -251 1211 -582 349 -365 534 -827 534 -1330 0 -658 -324 -1250 -885
          -1618 -218 -143 -510 -248 -788 -285 -810 -106 -1606 323 -1966 1060 -363 741
          -215 1619 369 2204 398 397 968 603 1525 551z"/>
          <path d="M3180 3389 c-14 -5 -159 -143 -322 -307 l-298 -297 -297 297 c-322
          320 -321 320 -410 303 -49 -9 -109 -69 -118 -118 -17 -89 -17 -88 303 -410
          l297 -297 -195 -198 c-383 -387 -408 -414 -415 -456 -22 -115 84 -215 198
          -186 37 10 77 47 339 313 l297 302 303 -302 c263 -261 309 -303 346 -313 60
          -16 111 1 155 49 39 44 53 91 43 149 -6 32 -45 75 -314 340 l-307 302 297 293
          c163 160 302 302 308 315 19 39 14 118 -10 157 -38 62 -130 91 -200 64z"/>
        </g>
      </svg>
      <form id='addForm' onSubmit={sendInfos}>
        <div className="InfoFilm">
          <label htmlFor="Title" className="label">Título do filme</label>
          <input type="text" id="Title" placeholder="Digite o nome do Filme" required />
        </div>

        <div className="InfoFilm">
          <label htmlFor="Avaliation" className="label">Avaliação do usuário</label>
          <input type="text" id="Avaliation" placeholder="Digite sua avaliação" required />
        </div>

        <h2>Em qual lista deseja adicionar?</h2>
        <div className="InfoFilm">
          <div id="choose_list">
            <div className="options_movies">
              <label htmlFor="watched">Assistidos</label>
              <input
                type="radio"
                name="status"
                id="watched"
                checked={IsWatched}
                onChange={() => {
                  SetIsWatched(true);
                  SetIsAbandoned(false);
                }}
              />
            </div>

            <div className="options_movies">
              <label htmlFor="Abandoned">Abandonados</label>
              <input
                type="radio"
                name="status"
                id="Abandoned"
                checked={IsAbandoned}
                onChange={() => {
                  SetIsWatched(false);
                  SetIsAbandoned(true);
                }}
              />
            </div>
          </div>
        </div>

        {/* Exibe a mensagem de erro */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button id='finishButton'>CONCLUIR</button>
      </form>
    </div>
  );
}