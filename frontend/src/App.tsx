import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/login/login';
import Cadastro from './pages/cadastro/cadastro';
import AlbumGallery from './pages/albumList/AlbumGallery';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/albumList" element={<AlbumGallery />} />
      </Routes>
    </Router>
  );
}

export default App;