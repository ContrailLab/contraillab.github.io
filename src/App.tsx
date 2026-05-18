import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AppLayout from './sections/AppLayout';
import Home from './sections/Home';
import Datasets from './sections/Datasets';
import Exhibition from './sections/Exhibition';
import Models from './sections/Models';
import Monitor from './sections/Monitor';
import Publications from './sections/Publications';

gsap.registerPlugin(ScrollTrigger);

export type PageRoute = 'home' | 'datasets' | 'exhibition' | 'models' | 'monitor' | 'publications';

function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Re-initialize ScrollTrigger after page change
    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const navigateTo = (page: PageRoute) => {
    if (page === currentPage) return;
    setIsTransitioning(true);
    
    // Kill all existing ScrollTriggers before navigation
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo(0, 0);
      setIsTransitioning(false);
    }, 300);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigateTo} />;
      case 'datasets':
        return <Datasets />;
      case 'exhibition':
        return <Exhibition />;
      case 'models':
        return <Models />;
      case 'monitor':
        return <Monitor />;
      case 'publications':
        return <Publications />;
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <AppLayout currentPage={currentPage} onNavigate={navigateTo}>
      <div
        ref={mainRef}
        className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      >
        {renderPage()}
      </div>
    </AppLayout>
  );
}

export default App;
