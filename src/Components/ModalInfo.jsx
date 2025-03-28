
import { X } from 'lucide-react';

export const ModalInfo = (  { selectedItem, results, isDarkMode, closeModal } ) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div
            className={`rounded-lg p-6 max-w-md w-full ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedItem.name}</h2>
              <button onClick={closeModal}>
                <X className="w-6 h-6 hover:text-red-600" />
              </button>
            </div>

            {results.type === 'people' ? (
              <div className="space-y-2">
                <p>Altura: {selectedItem.height} cm</p>
                <p>Masa: {selectedItem.mass} kg</p>
                <p>Color de pelo: {selectedItem.hair_color}</p>
                <p>Color de piel: {selectedItem.skin_color}</p>
                <p>Color de ojos: {selectedItem.eye_color}</p>
                <p>Año de nacimiento: {selectedItem.birth_year}</p>
                <p>Género: {selectedItem.gender}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p>Modelo: {selectedItem.model}</p>
                <p>Fabricante: {selectedItem.manufacturer}</p>
                <p>Costo en créditos: {selectedItem.cost_in_credits}</p>
                <p>Longitud: {selectedItem.length}</p>
                <p>Tripulación máxima: {selectedItem.crew}</p>
                <p>Pasajeros: {selectedItem.passengers}</p>
                <p>Capacidad de carga: {selectedItem.cargo_capacity}</p>
              </div>
            )}
          </div>
        </div>
  )
}
