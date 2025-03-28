

import axios from 'axios';

const API_BASE =  import.meta.env.VITE_API_HOST ;

export const GetData = async (category, name) => {
    try {
       
        const response = await axios.get(`${API_BASE}${category}/?search=${name}`);
          
        return response.data.results;
        
    } catch (error) {
        console.error(`Error al obtener ${category}:`, error);
        return null;
    }
}