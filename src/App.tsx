import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import './styles/App.css';

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/content/:id" element={<DetailPage />} />
  </Routes>
);

export default App;
