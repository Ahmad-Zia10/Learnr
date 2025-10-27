import { useState } from 'react'
import './App.css'
import Header from './components/common/Header/Header'
import { Outlet } from 'react-router-dom'
import Container from './components/container/Container'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Container>
      <Header/>
      <Outlet/>
    </Container>
    </>
  )
}

export default App
