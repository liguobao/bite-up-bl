import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import DetailPage from './pages/DetailPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FriendLinksPage from './pages/FriendLinksPage';
import BvToAvPage from './pages/BvToAvPage';
import './styles/App.css';

const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/links" element={<FriendLinksPage />} />
      <Route path="/bv-to-av" element={<BvToAvPage />} />
      <Route path="/content/:bvid" element={<DetailPage />} />
    </Route>
  </Routes>
);

export default App;
