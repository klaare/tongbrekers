import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { TongbrekersPage } from './pages/TongbrekersPage';
import { CondoleancesPage } from './pages/CondoleancesPage';
import { SpreukenPage } from './pages/SpreukenPage';
import { KanslozeCvPage } from './pages/KanslozeCvPage';
import { FobieenPage } from './pages/FobieenPage';
import { ExcuusExMachinaPage } from './pages/ExcuusExMachinaPage';
import { DestructieveDraaiboeken } from './pages/DestructieveDraaiboeken';
import { HopelozeHaikusPage } from './pages/HopelozeHaikusPage';
import { usePageMeta } from './hooks/usePageMeta';

function AppContent() {
  usePageMeta();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tongbrekers" element={<TongbrekersPage />} />
        <Route path="/condoleances" element={<CondoleancesPage />} />
        <Route path="/spreuken" element={<SpreukenPage />} />
        <Route path="/kansloze-cv" element={<KanslozeCvPage />} />
        <Route path="/fobieen" element={<FobieenPage />} />
        <Route path="/excuses" element={<ExcuusExMachinaPage />} />
        <Route path="/draaiboeken" element={<DestructieveDraaiboeken />} />
        <Route path="/haikus" element={<HopelozeHaikusPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
