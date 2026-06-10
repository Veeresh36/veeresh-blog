import { useState } from 'react'
import './App.css'
import Approuter from '../src/routees/Approuter'
import { HelmetProvider } from 'react-helmet-async'

function App() {
  return (
    <HelmetProvider>
      <Approuter />
    </HelmetProvider>
  );
}

export default App