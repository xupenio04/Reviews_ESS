// pages/notes/index.js
"use client"

import DataInterface from '../../components/DataInterface';
import Header from '../../components/Header';


export default function Home() {
  return (
    <div>
      <Header/>
      <DataInterface />
    </div>
  );
}