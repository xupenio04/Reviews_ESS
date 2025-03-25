'use client';

import './movieRegister.css'
import ImageIcon from './imageIcon'

import { useEffect, useState } from "react";

export default function FilterReviews() {
    const [movieTitle, setMovieTitle] = useState('');
    const [movieSynopsis, setMovieSynopsis] = useState('');
    const [movieGenre, setMovieGenre] = useState('');
    const [movieRating, setMovieRating] = useState('');
    const [movieCover, setMovieCover] = useState('')

    const [errorMessage, setErrorMessage] = useState(null);
    const [confirmationMessage, setConfirmationMessage] = useState(null);

    const [confirmButton, setConfirmButton] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [tempCoverURL, setTempCoverURL] = useState(''); // Estado temporário

    const handleSaveImageUrl = () => {
        setMovieCover(tempCoverURL); // Atualiza apenas ao clicar em "Salvar"
        setIsModalOpen(false); // Fecha o pop-up após salvar
    };

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmButton(true); // Ativa o estado para disparar o useEffect
        console.log({
            title: movieTitle,
            synopsis: movieSynopsis,
            genre: movieGenre,
            rating: movieRating,
            cover: movieCover
        });
    };

    useEffect(() => {
        async function addMovies() {
            // Verifica se todos os campos estão preenchidos
            if (movieTitle && movieGenre && movieRating && movieCover) {
                const requestBody = {
                    name: movieTitle,
                    synopsis: movieSynopsis,
                    genre: movieGenre,
                    rating: movieRating,
                    cover: {
                        imageURL: movieCover,
                        title: movieTitle
                    }
                };
                console.log(requestBody)
                try {
                    const response = await fetch("http://localhost:5001/movies/add", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(requestBody)
                    });
    
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(`Erro na requisição: ${response.status}`);
                    }

    
                    console.log('Filme adicionado:', data);
                    setConfirmationMessage('Filme adicionado: ')
                } catch (error) {
                    console.error("Erro ao adicionar filme:", error);
                    setErrorMessage(`Falha ao cadastrar o filme. Verifique os campos e tente novamente.`);
                }
            } else {
                setErrorMessage("Todos os campos devem ser preenchidos.");
            }
        }
    
        if (confirmButton) {
            addMovies();
            setConfirmButton(false); // Reseta o estado após a requisição
        }
    }, [confirmButton, movieTitle, movieSynopsis, movieGenre, movieRating, movieCover]);


    return (
        <div id="container">
            <form onSubmit={handleSubmit}>
                <div id='horizontal'>
                {movieCover ? (
                    <img src={movieCover} alt="Imagem do filme" width={200} height={200} className="image" />
                    ) : (
                    <div id='foto' onClick = {handleImageClick}>
                        <div id="adicionarImagem">
                            <ImageIcon />
                            <h1 id="textaddim">Adicionar Imagem</h1>
                        </div>
                    </div>
                    )}
                    <div id='campos'>
                        <div id="titleSpace">
                            <label htmlFor="movieTitle">Título do Filme:</label>
                            <input
                                type="text"
                                id="movieTitle"
                                value={movieTitle}
                                onChange={(e) => setMovieTitle(e.target.value)}
                                placeholder="Digite o título do filme"
                            />
                        </div>
                        <div id='miniContainer'>
                            <div>
                                <label htmlFor="movieGenre">Gênero do Filme:</label>
                                <input
                                    id="movieGenre"
                                    value={movieGenre}
                                    onChange={(e) => setMovieGenre(e.target.value)}
                                    placeholder="Digite o gênero do filme"
                                />
                            </div>
                            <div>
                                <label htmlFor="movieRating">Classificação Indicativa:</label>
                                <select
                                    id="movieRating"
                                    value={movieRating}
                                    onChange={(e) => setMovieRating(e.target.value)}
                                >
                                    <option value="">--</option>
                                    <option value="Livre">Livre</option>
                                    <option value="10">10</option>
                                    <option value="12">12</option>
                                    <option value="14">14</option>
                                    <option value="16">16</option>
                                    <option value="+18">+18</option>
                                </select>
                            </div>
                            
                        </div>
                        <div>
                            <label htmlFor="movieSynopsis">Sinopse do Filme:</label>
                            <textarea
                                id="movieSynopsis"
                                value={movieSynopsis}
                                onChange={(e) => setMovieSynopsis(e.target.value)}
                                placeholder="Digite uma breve descrição"
                            />
                        </div>
                        <button type="submit" id="env" onClick={handleSubmit}>Cadastrar Filme</button>
                    </div>
                </div>
            </form>
            {isModalOpen && (
                <div id="modalOverlay">
                    <div id="modal">
                        <h2>Adicionar URL da Imagem</h2>
                        <input
                            type="text"
                            placeholder="Cole a URL da imagem aqui"
                            value={tempCoverURL}
                            onChange={(e) => setTempCoverURL(e.target.value)}
                        />
                        <div id="modalButtons">
                            <button onClick={handleSaveImageUrl}>Salvar</button>
                            <button onClick={handleCloseModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
            {errorMessage && (
                <div id="errorNotification">
                    <p>{errorMessage}</p>
                    <button onClick={() => setErrorMessage(null)}>Fechar</button>
                </div>
            )}
            {confirmationMessage && (
                <div id="confirmationNotification">
                    <p>{confirmationMessage}</p>
                    <button onClick={() => setConfirmationMessage(null)}>Fechar</button>
                </div>
            )}
        </div>
    );
}