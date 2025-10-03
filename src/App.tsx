import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import DetailPage from './pages/DetailPage';
import HomePage from './pages/HomePage';
import './styles/App.css';

const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/content/:bvid" element={<DetailPage />} />
    </Route>
  </Routes>
);

export default App;
