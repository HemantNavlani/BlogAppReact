import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  console.log(import.meta.env.VITE_APPWRITE_URL);
  return (
  <h1 className='text-3xl'>Blog App with Appwrite</h1>
  )
}

export default App
