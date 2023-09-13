import axios from 'axios'; 
const BASE_URL = 'https://pixabay.com/api/';

async function getImages(page, query) { 
  const params = new URLSearchParams({ 
    key: '39076594-40f947c0249a2467761500a04',
    per_page: 40,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  return await axios.get(`${BASE_URL}?${params}`);
}

export { getImages };