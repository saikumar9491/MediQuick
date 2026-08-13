import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import MobileHeader from '../components/mobile/MobileHeader';
import MobileSearchBar from '../components/mobile/MobileSearchBar';
import MobileBottomTabBar from '../components/mobile/MobileBottomTabBar';

const MobileAppLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Immersive screens where the bottom tab bar or header should be hidden
  const hideHeaderRoutes = ['/verify-otp', '/reset-password', '/checkout', '/order-confirmation', '/categories'];
  const hideBottomBarRoutes = ['/verify-otp', '/reset-password', '/checkout', '/order-confirmation', '/categories'];

  const shouldHideHeader = hideHeaderRoutes.some(r => currentPath.startsWith(r));
  const shouldHideBottomBar = hideBottomBarRoutes.some(r => currentPath.startsWith(r)) || isKeyboardOpen;

  // Detect keyboard visibility to hide bottom tab bar when typing
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const isKeyboard = window.visualViewport.height < window.innerHeight * 0.85;
        setIsKeyboardOpen(isKeyboard);
      } else {
        const isKeyboard = window.innerHeight < window.screen.height * 0.5;
        setIsKeyboardOpen(isKeyboard);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll to transition from hero mode to regular white header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero mode: on home page, not scrolled, header/search are transparent
  const isHomePage = currentPath === '/';
  const isHeroMode = isHomePage && !isScrolled && !shouldHideHeader;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">

      {/* ── Full-bleed warm gradient backdrop ──────────────────────────────
          This fixed layer sits BELOW the header/search bar (z-30) but
          ABOVE the page background, covering the top ~280px with the warm
          hero gradient. It fades out when the user scrolls (isHeroMode false).
          Only visible on the home page.
      ──────────────────────────────────────────────────────────────────── */}
      {isHomePage && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            /* height covers header (52px) + searchbar (52px) + tabs (56px) + banner (210px) + small buffer */
            height: '390px',
            background: 'linear-gradient(180deg, #FFE0B2 0%, #FFCC80 45%, #FFE0B2 75%, #FFF8EF 100%)',
            zIndex: 1,
            pointerEvents: 'none',
            transition: 'opacity 350ms ease',
            opacity: isHeroMode ? 1 : 0,
          }}
        />
      )}

      {/* 1. Header Bar (Fixed, above warm gradient backdrop z-40) */}
      {!shouldHideHeader && (
        <MobileHeader
          isHidden={isHomePage && isScrolled}
          isHeroMode={isHeroMode}
        />
      )}

      {/* Search Bar (pins to top when scrolled) */}
      {isHomePage && !shouldHideHeader && (
        <MobileSearchBar
          isExpandedExternal={isSearchExpanded}
          onCloseExternal={() => setIsSearchExpanded(false)}
          isScrolled={isScrolled}
          isHeroMode={isHeroMode}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col relative z-10 ${
        shouldHideHeader
          ? ''
          : isHomePage
            ? 'pt-28'
            : 'pt-14'
      } ${shouldHideBottomBar ? '' : 'pb-16'}`}>
        <Outlet context={{ isSearchExpanded, setIsSearchExpanded, shouldHideBottomBar }} />
      </main>

      {/* 2. Search Overlay from other pages */}
      {currentPath !== '/' && isSearchExpanded && (
        <MobileSearchBar
          isExpandedExternal={isSearchExpanded}
          onCloseExternal={() => setIsSearchExpanded(false)}
        />
      )}

      {/* 3. Bottom Tab Bar */}
      {!shouldHideBottomBar && (
        <MobileBottomTabBar
          onSearchTabClick={() => setIsSearchExpanded(true)}
        />
      )}
    </div>
  );
};

export default MobileAppLayout;
