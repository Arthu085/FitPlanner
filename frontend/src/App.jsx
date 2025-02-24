import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister/LoginRegister'
import Home from './pages/Home/Home';
import Exercicios from './pages/Exercicios/Exercicios';
import Metas from './pages/Metas/Metas';
import Agenda from './pages/Agenda/Agenda';

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path='/' element={<LoginRegister />} />
          <Route path='/home' element={<Home />} />
          <Route path='/exercicios' element={<Exercicios />} />
          <Route path='/metas' element={<Metas />} />
          <Route path='/agenda' element={<Agenda />} />
        </Routes>
    </Router>
  );
};

export default App
