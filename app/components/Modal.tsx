'use client'; // Indica que este é um componente do lado do cliente
import { faArrowLeft, faTrash, faPen, faSave, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from "react";

type ProfileModalProps = {
    onClose: () => void;
};

export default function ProfileModal({ onClose }: ProfileModalProps) {
    const [email, setEmail] = useState("ajs6@gmail.com");
    const [name, setName] = useState("alex");

    useEffect(() => {
        setEmail(JSON.parse(localStorage.getItem('userEmail') || '{}'));
        setName(JSON.parse(localStorage.getItem('userName') || '{}'));
        
    }, []);

    return (
        <div
            className="fixed border-none rounded-lg drop-shadow-xl inset-y-0 right-0 bg-[#387478] w-64 h-70 top-10 right-10 shadow-lg z-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="p-6">
                <span
                    className="absolute top-4 right-4 text-xl cursor-pointer hover:text-red-500"
                    onClick={onClose}
                >
                    <FontAwesomeIcon
                        size="2x"
                        icon={faTimes} // Ícone de voltar
                        className="text-black hover:text-red-600 cursor-pointer h-8 w-8"
                        onClick={() => onClose}
                    />
                </span>
                <div className=" ">
                    <h2 className="text-xl font-bold mb-4">Usuário</h2>
                    <p className="mb-2"><strong>Nome:</strong></p>
                    <p>{name.toString()}</p>
                    <p className="mb-2"><strong>Email:</strong> </p>
                    <p>{email.toString()}</p>
                </div>
            </div>
        </div>
    );
}