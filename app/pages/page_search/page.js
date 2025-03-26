"use client";
import { useState, useEffect } from 'react';
import './style_pageSearch.css';
import { useRouter } from 'next/navigation'; // Importe o useRouter
import SearchBar from '../../components/search_bar/search_bar';
import UserCard from '../../components/user_card/user_card';
import Footer from '../../components/footer/Footer';


export default function PageSearch() {
  const router = useRouter(); // Inicialize o useRouter
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

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

  const handleUserCardClick = () => {
    // Salva os dados do usuário no localStorage antes de redirecionar
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log("Card clicado! Dados do usuário salvos.");

    // Redireciona para a página de perfil do usuário
    setTimeout(() => {
      window.location.href = '/pages/page_userProfile';
    }, 200);
  };

  // Função para voltar à página anterior
  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="page-container">
      <div className="top-banner">
        <div data-testid ="search-bar">
          <SearchBar onSearch={handleSearch} />
        </div>
        <button className="back-button" onClick={handleGoBack}>
          Voltar
        </button>
      </div>

      {userData ? (
          <div className="user-card-container">
          <div data-testid = "user_card">
            <UserCard 
              name={userData.name}
              reviews= "Clique para acessar o perfil"
              avatar={
                <div className="avatar">
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 243 243"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1201_5658)">
                      <ellipse cx="119" cy="139.5" rx="106" ry="106.5" fill="#629584" />
                      <path d="M123.674 158.627C145.457 158.627 163.116 140.969 163.116 119.186C163.116 97.4033 145.457 79.7448 123.674 79.7448C101.891 79.7448 84.2329 97.4033 84.2329 119.186C84.2329 140.969 101.891 158.627 123.674 158.627Z" fill="#F1C8C8" />
                      <path d="M101.032 164.46L99.2503 146.448L134.833 139.794L155.844 190.952L119.303 232.975L93.2671 181.817L101.032 164.46Z" fill="#F1C8C8" />
                      <path d="M98.6787 155.464L106.458 157.222C106.458 157.222 100.343 137.83 102.418 135.978C104.494 134.127 109.58 137.044 109.58 137.044L114.926 143.037L121.436 136.408C121.436 136.408 128.505 127.619 131.272 125.151C134.04 122.682 129.595 113.52 129.595 113.52C129.595 113.52 170.654 102.448 155.376 82.5327C155.376 82.5327 146.418 66.9183 143.501 72.0048C140.584 77.0913 137.106 69.0129 137.106 69.0129L126.484 71.0327C126.484 71.0327 105.521 58.6724 85.6247 85.1147C65.7284 111.557 98.6787 155.464 98.6787 155.464Z" fill="#2F2E41" />
                      <path d="M197.853 216.028C176.298 233.504 149.632 243 121.5 243C95.8112 243 71.3422 235.08 50.8745 220.399C50.9111 220.015 50.9476 219.636 50.9796 219.257C51.5231 213.319 52.0073 207.546 52.327 202.759C53.5649 184.173 96.9258 171.785 96.9258 171.785C96.9258 171.785 97.1222 171.982 97.515 172.324C99.9085 174.426 109.624 182.044 126.661 184.173C141.853 186.073 146.855 177.061 148.367 172.745C148.824 171.429 148.961 170.548 148.961 170.548L193.559 191.609C196.469 195.766 197.606 204.718 197.83 214.781C197.839 215.197 197.848 215.608 197.853 216.028Z" fill="#F9A826" />
                    </g>
                    <defs>
                      <clipPath id="clip0_1201_5658">
                        <rect width="243" height="243" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              }
              onClick={handleUserCardClick} 
            />
          </div>
        </div>
      ) : (
        error && <p className="error-message">{error}</p>
      )}
      <Footer/>
    </div>  
  );
}