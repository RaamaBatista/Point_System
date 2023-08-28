import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Cadastro from './pages/cadastro/cadastro'
import Login from './pages/login/login'
import Principal from './pages/principal/principal'
function App() {

  return (
  
    <BrowserRouter>
      <Routes>
      
        <Route index element={<Cadastro/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/principal' element={<Principal/>}/>
     
      </Routes>
    </BrowserRouter>

  )
}

export default App