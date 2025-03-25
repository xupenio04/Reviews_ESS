// pages/notes/index.js

import DataInterface from '../../../components/DataInterfaceDinamic';
import Header from '../../../components/Header';
//import React, { useState, useEffect } from "react";

export default async function Home({ params }) {
  const resolvedParams = await params;
  const { nome } = resolvedParams;
 
  return (
    <div>
      <Header/>
      <DataInterface nome={nome} />
    </div>
  );
}