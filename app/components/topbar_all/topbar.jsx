import SearchBar from "../searchbar/searchbar";
import topbar from './topbar.css'
import { useEffect, useState } from 'react';

const handleClick = () => {
    setTimeout(() => {
      window.location.href = '/pages/page_search';
    }, 200);
  };

const handleProfile = async () => {
    const storedUserName = localStorage.getItem('userName');
    const parsedUserName = JSON.parse(storedUserName);
    console.log(parsedUserName.user.name)

    try {
        const response = await fetch(`http://localhost:5001/users/find/${parsedUserName.user.name}`);
        if (response.status === 200) {
            setTimeout(() => {
                window.location.href = '/pages/page_userProfile';
            }, 200);
        } else {
          setError("Usuário não encontrado");
        }
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        setError("Erro ao conectar ao servidor.");
      }

};

const TopBar = () => {

    return(
        <div id='topbar'>
            <button onClick={handleProfile} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
            <div id='profile_infos'>
                            <svg id ='avatar' width="130" height="80" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_1355_1795)">
                                <ellipse cx="63.6624" cy="74.6296" rx="56.7078" ry="56.9753" fill="#629584"/>
                                <path d="M66.1633 84.8627C77.8167 84.8627 87.2636 75.4158 87.2636 63.7624C87.2636 52.109 77.8167 42.6621 66.1633 42.6621C54.5099 42.6621 45.063 52.109 45.063 63.7624C45.063 75.4158 54.5099 84.8627 66.1633 84.8627Z" fill="#FFB6B6"/>
                                <path d="M54.0501 87.9826L53.0969 78.3466L72.1328 74.7871L83.3734 102.156L63.8246 124.637L49.896 97.2683L54.0501 87.9826Z" fill="#FFB6B6"/>
                                <path d="M52.7911 83.1697L56.9528 84.1101C56.9528 84.1101 53.6813 73.7358 54.7917 72.7454C55.9021 71.755 58.6233 73.3156 58.6233 73.3156L61.4828 76.5216L64.9659 72.9753C64.9659 72.9753 68.7474 68.2733 70.228 66.9527C71.7086 65.6321 69.3304 60.7304 69.3304 60.7304C69.3304 60.7304 91.2964 54.8073 83.1228 44.153C83.1228 44.153 78.3307 35.7997 76.7701 38.5208C75.2095 41.242 73.3487 36.9202 73.3487 36.9202L67.6663 38.0008C67.6663 38.0008 56.4516 31.3883 45.8075 45.5343C35.1633 59.6804 52.7911 83.1697 52.7911 83.1697Z" fill="#2F2E41"/>
                                <path d="M105.847 115.57C94.3159 124.92 80.0501 130 64.9999 130C51.257 130 38.1666 125.763 27.2168 117.909C27.2364 117.704 27.2559 117.501 27.273 117.298C27.5638 114.121 27.8228 111.032 27.9939 108.472C28.6561 98.5286 51.8533 91.9015 51.8533 91.9015C51.8533 91.9015 51.9583 92.0066 52.1685 92.1898C53.4489 93.3139 58.6465 97.3898 67.7612 98.5285C75.8886 99.5451 78.5644 94.7238 79.3732 92.4146C79.6175 91.7109 79.6909 91.2393 79.6909 91.2393L103.55 102.507C105.107 104.73 105.715 109.52 105.835 114.903C105.84 115.126 105.845 115.345 105.847 115.57Z" fill="#243642"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_1355_1795">
                                <rect width="130" height="130" fill="white"/>
                                </clipPath>
                                </defs>
                                </svg>
                        </div>
                </button>
                        <button onClick={handleClick} style={{ border: "none", background: "transparent" }}>
                            <SearchBar />
                        </button>
        </div>
        
    )

}

export default TopBar;