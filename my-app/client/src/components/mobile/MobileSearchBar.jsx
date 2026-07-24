import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Mic, Scan, ArrowLeft, X, Trash2, Clock, Zap } from 'lucide-react';
import { API_BASE } from '../../utils/apiConfig';
import toast from 'react-hot-toast';

const MobileSearchBar = ({ isExpandedExternal, onCloseExternal }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const searchInputRef = useRef(null);

  // Sync with external trigger if provided (e.g., from Bottom Tab Bar clicking Search)
  useEffect(() => {
    if (isExpandedExternal) {
      setIsExpanded(true);
      setTimeout(() => searchInputRef.current?.focus(), 150);
    }
  }, [isExpandedExternal]);

  // Load recent and trending searches
  useEffect(() => {
    if (isExpanded) {
      // Recent searches from local storage
      try {
        const stored = localStorage.getItem('mq_recent_searches');
        setRecentSearches(stored ? JSON.parse(stored) : []);
      } catch (e) {
        setRecentSearches([]);
      }

      // Fetch real trending searches from backend
      fetch(`${API_BASE}/api/medicines/trending-searches`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setTrendingSearches(data);
          }
        })
        .catch(err => {
          console.error("Error loading trending searches", err);
          setTrendingSearches(['paracetamol', 'vitamin c', 'cough syrup', 'face wash', 'shampoo']);
        });
    }
  }, [isExpanded]);

  // Fetch results live as user types (debounced)
  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length === 0) {
      setSearchResults([]);
      return;
    }

    setIsLoadingResults(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/medicines?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        const results = Array.isArray(data) ? data : (data?.medicines || []);
        setSearchResults(results.slice(0, 8));
      } catch (err) {
        console.error("Search fetch error", err);
      } finally {
        setIsLoadingResults(false);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleOpenSearch = () => {
    setIsExpanded(true);
    setTimeout(() => searchInputRef.current?.focus(), 150);
  };

  const handleCloseSearch = () => {
    setIsExpanded(false);
    setSearchQuery('');
    setSearchResults([]);
    if (onCloseExternal) onCloseExternal();
  };

  const handleSearchSubmit = (e, queryText) => {
    if (e) e.preventDefault();
    const finalQuery = queryText || searchQuery;
    if (!finalQuery.trim()) return;

    // Save to recents
    const query = finalQuery.trim();
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem('mq_recent_searches', JSON.stringify(updated));

    handleCloseSearch();
    navigate(`/medicines?search=${encodeURIComponent(query)}`);
  };

  const handleClearRecents = () => {
    setRecentSearches([]);
    localStorage.setItem('mq_recent_searches', JSON.stringify([]));
    toast.success('Recent searches cleared');
  };

  const handleRemoveRecentItem = (e, item) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== item);
    setRecentSearches(updated);
    localStorage.setItem('mq_recent_searches', JSON.stringify(updated));
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice search is not supported by your browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    toast('Listening...', { icon: '🎙️' });
    recognition.start();

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setSearchQuery(speechToText);
      toast.success(`Search for: "${speechToText}"`);
    };

    recognition.onerror = (event) => {
      console.error(event);
      toast.error('Voice recognition failed. Please try again.');
    };
  };

  const handleBarcodeScan = () => {
    toast('Scanning product barcodes coming soon!', { icon: '📷' });
  };

  // Category shortcuts for search helper
  const searchCategories = [
    { name: 'Medicines', filter: '' },
    { name: 'Skin Care', filter: 'skin-care' },
    { name: 'Hair Care', filter: 'hair-care' },
    { name: 'Ayurveda', filter: 'ayurveda' },
    { name: 'Fitness', filter: 'fitness' }
  ];

  return (
    <>
      {/* Standard closed state bar - fixed below header */}
      <div className="fixed top-14 left-0 right-0 z-35 bg-white px-4 py-2 border-b border-slate-150 h-14 flex items-center">
        <div 
          onClick={handleOpenSearch}
          className="w-full h-10 rounded-full bg-slate-100/90 border border-slate-200/80 px-4 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-slate-400">
            <Search size={16} />
            <span className="text-[13px] font-medium text-slate-500 truncate max-w-[240px]">Search for medicines, wellness...</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); handleVoiceSearch(); }} 
              className="p-1 hover:text-slate-650 transition-colors"
              title="Voice Search"
            >
              <Mic size={15} />
            </button>
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); handleBarcodeScan(); }} 
              className="p-1 hover:text-slate-650 transition-colors border-l border-slate-250 pl-2.5"
              title="Scan Barcode"
            >
              <Scan size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded full-screen search overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-[160] bg-white flex flex-col animate-in fade-in duration-200">
          {/* Header row */}
          <div className="h-14 px-4 border-b border-slate-150 flex items-center gap-3 shrink-0">
            <button 
              onClick={handleCloseSearch}
              className="p-1 hover:bg-slate-100 rounded-full"
              title="Back"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            
            <form onSubmit={(e) => handleSearchSubmit(e)} className="flex-1 relative flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search medicines, wellness items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 rounded-full bg-slate-50 border border-slate-250 pl-4 pr-10 text-[14px] font-semibold outline-none focus:border-[#00a2a4] focus:bg-white focus:ring-4 focus:ring-teal-50"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 hover:bg-slate-200 rounded-full"
                >
                  <X size={14} className="text-slate-500" />
                </button>
              )}
            </form>

            <button 
              onClick={handleVoiceSearch} 
              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500"
              title="Voice Search"
            >
              <Mic size={20} />
            </button>
          </div>

          {/* Results/Suggestion area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
            {/* Live Search Results */}
            {searchQuery.trim() !== '' && (
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matched Products</span>
                {isLoadingResults && (
                  <div className="py-8 text-center text-xs text-slate-400 font-bold uppercase animate-pulse">Searching...</div>
                )}
                {!isLoadingResults && searchResults.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-400 font-bold uppercase">No products found</div>
                )}
                {!isLoadingResults && searchResults.length > 0 && (
                  <div className="divide-y divide-slate-100 bg-slate-50 rounded-2xl border border-slate-150 overflow-hidden">
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        onClick={handleCloseSearch}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 transition-colors"
                      >
                        <img 
                          src={product.image} 
                          alt="" 
                          className="h-10 w-10 object-contain rounded bg-white p-1 border border-slate-200" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-bold text-slate-800 truncate">{product.name}</p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-tight">{product.brand}</p>
                        </div>
                        <span className="text-xs font-black text-[#00a2a4]">₹{product.price}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Default overlay recommendations (only shown when query is empty) */}
            {searchQuery.trim() === '' && (
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Searches</span>
                      <button 
                        onClick={handleClearRecents}
                        className="flex items-center gap-1 text-[10px] font-extrabold text-red-500 uppercase tracking-widest"
                      >
                        <Trash2 size={11} /> Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, i) => (
                        <div
                          key={i}
                          onClick={() => handleSearchSubmit(null, term)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-700 active:bg-slate-100 cursor-pointer"
                        >
                          <Clock size={11} className="text-slate-400" />
                          <span>{term}</span>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveRecentItem(e, term)}
                            className="p-0.5 hover:bg-slate-200 rounded-full"
                          >
                            <X size={10} className="text-slate-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                {trendingSearches.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Zap size={11} className="text-amber-500 fill-amber-500 animate-bounce" />
                      Trending Searches
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {trendingSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => handleSearchSubmit(null, term)}
                          className="text-left px-4 py-3 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 text-xs font-semibold text-slate-700 truncate active:scale-[0.98] transition-all flex items-center gap-2"
                        >
                          <span className="text-[10px] font-black text-[#00a2a4] bg-teal-50 h-5 w-5 rounded-full flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span className="truncate">{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Shortcuts */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Browse Categories</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {searchCategories.map((cat, i) => (
                      <Link
                        key={i}
                        to={`/medicines?filter=${cat.filter}`}
                        onClick={handleCloseSearch}
                        className="px-4 py-3 bg-slate-50 hover:bg-slate-100 text-center border border-slate-200 rounded-2xl text-xs font-bold text-slate-650 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileSearchBar;
