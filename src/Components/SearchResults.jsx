
import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';

import { ModalInfo  } from "./ModalInfo";

export const SearchResults = ({ results, isDarkMode, setFavorites, isShowingFavorites }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setLocalFavorites] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsPerPage = 9;

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setLocalFavorites(savedFavorites);
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.items.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(results.items.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleFavorite = (item) => {
    const updatedFavorites = [...favorites];
    const itemIndex = updatedFavorites.findIndex((fav) => fav.name === item.name);

    if (itemIndex > -1) {
      updatedFavorites.splice(itemIndex, 1);
    } else {
      updatedFavorites.push(item);
    }

    setLocalFavorites(updatedFavorites);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (item) => {
    return favorites.some((fav) => fav.name === item.name);
  };

  const openModal = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className={`p-4 ${isDarkMode ? ' text-white' : ' text-gray-900'}`}>
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-yellow-300' : 'text-blue-700'}`}>
        {isShowingFavorites ? 'Favoritos' : `Resultados de ${results.type === 'people' ? 'Personajes' : 'Naves'}`}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {currentItems.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-md transition-all duration-300 relative ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-blue-50'
            }`}
          >
            <button onClick={() => toggleFavorite(item)} className="absolute top-2 right-2 z-10">
              <Star
                className={`w-6 h-6 ${
                  isFavorite(item) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                }`}
              />
            </button>

            <div onClick={() => openModal(item)} className="cursor-pointer">
              <h3 className="font-semibold mb-2">{item.name}</h3>
              {results.type === 'people' ? (
                <div className="text-sm">
                  <p>Altura: {item.height} cm</p>
                  <p>Masa: {item.mass} kg</p>
                  <p>Color de pelo: {item.hair_color}</p>
                </div>
              ) : (
                <div className="text-sm">
                  <p>Modelo: {item.model}</p>
                  <p>Fabricante: {item.manufacturer}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentPage === index + 1
                ? isDarkMode
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-blue-500 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {selectedItem && (
        <ModalInfo
          selectedItem={selectedItem}
          results={results}
          isDarkMode={isDarkMode}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};