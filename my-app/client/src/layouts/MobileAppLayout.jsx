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

  // Track window scroll position to collapse top header and pin search bar on home page
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* 1. Header Bar (Fixed, Slides up when scrolled on home page) */}
      {!shouldHideHeader && (
        <MobileHeader isHidden={currentPath === '/' && isScrolled} />
      )}

      {/* Search Bar (Pins to top-0 when scrolled on home page) */}
      {currentPath === '/' && !shouldHideHeader && (
        <MobileSearchBar 
          isExpandedExternal={isSearchExpanded} 
          onCloseExternal={() => setIsSearchExpanded(false)} 
          isScrolled={isScrolled}
        />
      )}

      {/* Main Content Area (Scrollable with proper padding offsets) */}
      <main className={`flex-1 flex flex-col ${
        shouldHideHeader 
          ? '' 
          : currentPath === '/' 
            ? 'pt-28' // Offset for Header (14) + SearchBar (14) = 28 (7rem or 112px)
            : 'pt-14' // Offset for Header only
      } ${shouldHideBottomBar ? '' : 'pb-16'}`}>
        <Outlet context={{ isSearchExpanded, setIsSearchExpanded, shouldHideBottomBar }} />
      </main>

      {/* 2. Search Overlay Triggered from other pages */}
      {currentPath !== '/' && isSearchExpanded && (
        <MobileSearchBar 
          isExpandedExternal={isSearchExpanded} 
          onCloseExternal={() => setIsSearchExpanded(false)} 
        />
      )}

      {/* 3. Bottom Tab Bar (Fixed, Docked at Bottom) */}
      {!shouldHideBottomBar && (
        <MobileBottomTabBar 
          onSearchTabClick={() => setIsSearchExpanded(true)} 
        />
      )}
    </div>
  );
};

export default MobileAppLayout;
