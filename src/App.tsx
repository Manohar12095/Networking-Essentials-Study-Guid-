import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { UnitPage } from './pages/UnitPage';
import { TopicPage } from './pages/TopicPage';
import { RevisionMode } from './pages/RevisionMode';
import { QuizPage } from './pages/QuizPage';
import { Bookmarks } from './pages/Bookmarks';
import { SearchPage } from './pages/SearchPage';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--packet)]/20 selection:text-[var(--packet)]">
        <Header />

        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar />

          <main className="flex-1 w-full min-w-0 flex flex-col">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/unit/:n" element={<UnitPage />} />
                <Route path="/topic/:slug" element={<TopicPage />} />
                <Route path="/revise" element={<RevisionMode />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/quiz/:slug" element={<QuizPage />} />
                <Route path="/saved" element={<Bookmarks />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </main>
        </div>

        <BottomNav />
      </div>
    </HashRouter>
  );
};

export default App;
