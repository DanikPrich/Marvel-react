import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const {loading, request, error} = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKeyTemp = 'apikey=81f3f697d7f1277aea82c579fd4a1eab';
  const _apiKey = 'apikey=a4fdd89c59c787a3f9c7e4daf01647a8';
  const _baseOffset = 210;


//  getResource = async (url) => {
//     let res = await fetch(url);

//     if (!res.ok) {
//       throw new Error(`Could not fetch ${url}, status: ${res.status}`);
//     }

//     return await res.json();
//   }

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKeyTemp}`);
    /* Создаем массив с удобными для нас обьектами */
    return res.data.results.map(_transformCharacter);
  }

  const getCharacter = async (id) => {
     const res = await request(`${_apiBase}characters/${id}?${_apiKeyTemp}`);
    /* Создаем массив с удобными для нас обьектами */
     return _transformCharacter(res.data.results[0]);
  }

  /* Метод который переводит неудобные данные в удобный обьект */
  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      /* Обрезаем до 170 символов или если пустой пишем что описание отсутствует */
      description: char.description ? char.description.slice(0, char.description.slice(0, 170).lastIndexOf(' ')) + '...' : "Description is missing...",
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items
    }
  }

  return {loading, error, getAllCharacters, getCharacter }
}

export default useMarvelService;