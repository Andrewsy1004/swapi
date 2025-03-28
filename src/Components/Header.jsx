
import { useState, useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { GetData } from '../Helpers';
import { SearchResults } from './SearchResults';

export const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [searchHistory, setSearchHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('searchHistory')) || [];
  });

  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isShowingFavorites, setIsShowingFavorites] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.length >= 0 && !isShowingFavorites) {
        setIsLoading(true);
        try {
          const people = await GetData("people", searchTerm);
          const starships = await GetData("starships", searchTerm);

          if (people.length === 0 && starships.length === 0) {
            setSearchResults(null);
            return;
          }

          const results = people.length > 0 ? { items: people, type: "people" } : { items: starships, type: "starships" };
          setSearchResults(results);
        } catch (error) {
          console.error("Error en la búsqueda:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [searchTerm, isShowingFavorites]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && !searchHistory.includes(searchTerm)) {
      setSearchHistory((prev) => [searchTerm, ...prev]);
    }
    setSearchTerm('');
    setIsShowingFavorites(false);
  };

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
    setShowFavorites(false);
  };

  const toggleFavorites = () => {
    setShowFavorites((prev) => !prev);
    setShowHistory(false);

    if (!isShowingFavorites && favorites.length > 0) {
      setSearchResults({ items: favorites, type: favorites[0]?.height ? "people" : "starships" });
      setIsShowingFavorites(true);
    } else {
      setSearchResults(null);
      setIsShowingFavorites(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    setShowHistory(false);
  };

  return (
    <>
      <header
        className={`p-4 sticky top-0 z-20 shadow-md transition-colors duration-300 ${
          isDarkMode
            ? 'bg-gradient-to-r from-gray-900 to-blue-900 text-white'
            : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight hover:text-yellow-300 transition-colors">
            Star Wars Explorer
          </h1>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2 relative">
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Buscar personaje o nave..."
                  aria-label="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/90 dark:bg-gray-800/90 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm sm:text-base pr-10"
                />
                {isLoading && !isShowingFavorites && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 
                  border-2 border-t-transparent rounded-full animate-spin  border-white"></div>
                )}
              </div>
              <button
                type="submit"
                id="searchButton"
                className="px-3 py-2 bg-yellow-400 dark:bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-300 dark:hover:bg-yellow-600 transition-colors font-semibold text-sm sm:text-base whitespace-nowrap"
                disabled={isLoading}
              >
                🔍 Buscar
              </button>
            </form>
          </div>

          <nav className="relative flex flex-wrap justify-center gap-2">
            <button
              id="toggleDarkMode"
              onClick={toggleDarkMode}
              className="px-3 py-2 bg-white/20 dark:bg-gray-800/80 rounded-lg hover:bg-white/30 dark:hover:bg-gray-700/80 transition-colors flex items-center gap-1 text-white"
            >
              {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
            </button>
            <button
              id="showFavorites"
              onClick={toggleFavorites}
              className="px-3 py-2 bg-white/20 dark:bg-gray-800/80 rounded-lg hover:bg-white/30 dark:hover:bg-gray-700/80 transition-colors flex items-center gap-1 text-white"
            >
              <Star className="w-4 h-4 fill-yellow-400" /> Favoritos ({favorites.length})
            </button>
            <button
              id="showHistory"
              onClick={toggleHistory}
              className="px-3 py-2 bg-white/20 dark:bg-gray-800/80 rounded-lg hover:bg-white/30 dark:hover:bg-gray-700/80 transition-colors flex items-center gap-1 text-white"
            >
              📜 Historial
            </button>

            {showFavorites && (
              <div className="absolute top-12 right-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto z-30">
                {favorites.length > 0 ? (
                  <>
                    {favorites.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <span>{item.name}</span>
                        <button
                          onClick={() => {
                            const updatedFavorites = favorites.filter((fav) => fav.name !== item.name);
                            setFavorites(updatedFavorites);
                            if (isShowingFavorites) {
                              if (updatedFavorites.length === 0) {
                                setSearchResults(null);
                                setIsShowingFavorites(false);
                              } else {
                                setSearchResults({
                                  items: updatedFavorites,
                                  type: updatedFavorites[0]?.height ? 'people' : 'starships',
                                });
                              }
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setFavorites([]);
                        setShowFavorites(false);
                        if (isShowingFavorites) {
                          setSearchResults(null);
                          setIsShowingFavorites(false);
                        }
                      }}
                      className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Eliminar Todos los Favoritos
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-2 text-gray-900 dark:text-white">
                    No hay favoritos
                  </div>
                )}
              </div>
            )}

            {showHistory && (
              <div className="absolute top-12 right-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto z-30">
                {searchHistory.length > 0 ? (
                  <>
                    {searchHistory.map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        {item}
                      </div>
                    ))}
                    <button
                      onClick={clearHistory}
                      className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    >
                      🗑️ Eliminar Historial
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-2 text-gray-900 dark:text-white">
                    No hay historial
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      {searchResults && (
        <SearchResults
          results={searchResults}
          isDarkMode={isDarkMode}
          setFavorites={setFavorites}
          isShowingFavorites={isShowingFavorites}
        />
      )}
    </>
  );
};