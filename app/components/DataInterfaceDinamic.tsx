"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrash, faPen, faSave, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import { slice } from "cypress/types/lodash";

let UserEmail = 'ajs6@gmail.com';
const Name = 'alex'
const urlApi = process.env.NEXT_PUBLIC_API_URL;

export default function NotesList ({ nome })  {
  // States de dados
  const [notes, setNotes] = useState([]);
  const [email, setEmail] = useState("ajs6@gmail.com");
  const [name, setName] = useState("alex");
  // States de controle
  const [editingIndex, setEditingIndex] = useState(null);
  const [newNote, setNewNote] = useState({ title: "", note: "" });
  // States de flags
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: urlApi, // URL do backend
  });

  const fetchNotes = async () => {
    try {
      //const userName = JSON.parse(localStorage.getItem('userName') || '');
      if(nome !== ''){
        
        const user = await api.get(`/users/find/${nome}`);
        UserEmail = user.data.email;
        localStorage.setItem('userEmail', JSON.stringify(UserEmail));
      }else{
        const user = await api.get(`/users/find/${Name}`);
        UserEmail = user.data.email;
        localStorage.setItem('userEmail', JSON.stringify(UserEmail));
      }
      
      const response = await api.get(`/notes/${UserEmail}`);
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Erro ao buscar notas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  },[]);

  const handleDelete = async (index) => {
    const delNote = notes[index];
    try {
      await api.delete("/notes/dell", {
        data: {
          email: UserEmail,
          title: delNote.title,
        },
      });
      fetchNotes();
    } catch (error) {
      console.error("Erro ao excluir a nota:", error);
    }
  };

  const startEdit = (index) => {
    setEditingIndex(index);
  };

  const saveEdit = async (index) => {
    const updatedNote = notes[index];
    try {
      await api.put("/notes/edit", {
        email: UserEmail,
        title: updatedNote.title,
        note: updatedNote.note,
      });
      fetchNotes();
    } catch (error) {
      console.error("Erro ao salvar a nota:", error);
    }
    setEditingIndex(null);
  };

  const updateField = (index, field, value) => {
    setNotes((prevNotes) =>
      prevNotes.map((note, i) =>
        i === index ? { ...note, [field]: value } : note
      )
    );
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  const handleAddNote = async (e) => {
    e.preventDefault(); // Evitar recarregamento da página
    try {
      await api.post("/notes/add", {
        email: UserEmail,
        title: newNote.title,
        note: newNote.note,
      });
      setNewNote({ title: "", note: "" }); // Limpar o formulário
      fetchNotes(); // Atualizar a lista de notas
    } catch (error) {
      console.error("Erro ao adicionar a nota:", error);
    }
  };
  if (loading) return (
    <div className=" flex flex-col items-center text-black  p-6 ">
      <p>Carregando...</p>
    </div>
  );
  return (
    <div className="container mx-auto p-4 bg-[#FFF8F3] text-black">
      {/* Ícone de Voltar */}
      <div className="w-full ">
        <FontAwesomeIcon
          icon={faArrowLeft} // Ícone de voltar
          className="text-black hover:text-yellow-400 cursor-pointer h-4 w-4"
        />
      </div>
      <h2 className="text-2xl font-bold text-center p-4  mb-4 sm:text-3xl md:text-4xl lg:text-5xl ">
        Minhas Notas
      </h2>

      {/* Formulário para adicionar nova nota */}
      <form onSubmit={handleAddNote} className="p-4 border-none rounded-lg shadow-md bg-white sm:p-6 ">
        <div >
          <label className="block font-medium mb-2">
            Título:
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="w-full p-2 border-none rounded sm:p-3"
              placeholder="Digite o título"
              required
            />
          </label>
        </div>
        <div>
          <label className="block font-medium mb-2">
            Nota:
            <input
              type="text"
              value={newNote.note}
              onChange={(e) => setNewNote({ ...newNote, note: e.target.value })}
              className="w-full p-2 border-none rounded sm:p-3"
              placeholder="Digite a nota"
              required
            />
          </label>
        </div>
        <button type="submit">
          <FontAwesomeIcon
            type="submit"
            size="2x"
            icon={faPlus} // Ícone de voltar
            className="text-black hover:text-blue-600 cursor-pointer h-8 w-8"
          //onClick={() => handleAddNote}
          />
        </button>
      </form>
      {/* Lista de notas */}
      {notes.length > 0 ? (
        <ul className="space-y-4 p-4 ">
          {notes.map((note, index) => (
            <li
              key={index}
              className="p-4 border-none rounded-lg shadow-md bg-white hover:bg-yellow-400 sm:p-6"
            >
              {editingIndex === index ? (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium">
                      <strong>{note.title}</strong>
                      {/* Uncomment if you want to make the title editable */}
                      {/*
                      <input
                        type="text"
                        value={note.title}
                        className="w-full p-2 border rounded sm:p-3"
                        onChange={(e) => updateField(index, "title", e.target.value)}
                      />
                      */}
                    </label>
                  </div>
                  <div>
                    <label className="block font-medium">
                      <strong>Nota:</strong>
                      <input
                        type="text"
                        id='newNota'
                        value={note.note}
                        className="w-full p-2 border-none rounded sm:p-3"
                        onChange={(e) => updateField(index, "note", e.target.value)} />
                    </label>
                  </div>
                  {/* Botões */}
                  <div className="flex flex-row  justify-between  space-y-2">
                    {/*
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full sm:w-auto sm:px-6 sm:py-3"
                      onClick={() => saveEdit(index)}>
                      Salvar
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 w-full sm:w-auto sm:px-6 sm:py-3"
                      onClick={cancelEdit}>
                      Cancelar
                    </button>
                     */}
                    <FontAwesomeIcon
                      size="2x"
                      id="save"
                      icon={faSave} // Ícone de voltar
                      className="text-black hover:text-blue-600 cursor-pointer h-8 w-8"
                      onClick={() => saveEdit(index)}
                    />
                    <FontAwesomeIcon
                      size="2x"
                      icon={faTimes} // Ícone de voltar
                      className="text-black hover:text-red-600 cursor-pointer h-8 w-8"
                      onClick={() => cancelEdit()}
                    />

                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-col justify-between ">
                    {/* Título */}
                    <div className="font-medium">
                      <strong>Título:</strong> {note.title}
                    </div>
                    {/* Nota */}
                    <div className="font-medium">
                      <strong>Nota:</strong> {note.note}
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex flex-row justify-between  space-y-2 ">
                    {/* 
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 w-full sm:w-auto sm:px-4 sm:py-2"
                      onClick={() => startEdit(index)}>
                      Editar
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto sm:px-4 sm:py-2"
                      onClick={() => handleDelete(index)}>
                      Remover
                    </button>
                    */}
                    <FontAwesomeIcon
                      id="edit"
                      size="2x"
                      icon={faPen} // Ícone de voltar
                      className="text-black hover:text-blue-600 cursor-pointer h-8 w-8"
                      onClick={() => startEdit(index)}
                    />
                    <FontAwesomeIcon
                      id="dell"
                      size="2x"
                      icon={faTrash} // Ícone de voltar
                      className="text-black hover:text-red-600 cursor-pointer h-8 w-8"
                      onClick={() => handleDelete(index)}
                    />

                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600 sm:text-lg md:text-xl lg:text-2xl">
          Nenhuma nota encontrada.
        </p>
      )}
    </div>
  );
};
