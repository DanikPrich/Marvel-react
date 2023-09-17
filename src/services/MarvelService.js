import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const {loading, request, error, clearError} = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKeyTemp = 'apikey=81f3f697d7f1277aea82c579fd4a1eab';
  const _apiKey = 'apikey=a4fdd89c59c787a3f9c7e4daf01647a8';
  const _baseOffset = 210;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKeyTemp}`);
    /* Создаем массив с удобными для нас обьектами */
    return res.data.results.map(_transformCharacter);
  }

  const getCharacter = async (id) => {
    console.log(id)
     const res = await request(`${_apiBase}characters/${id}?${_apiKeyTemp}`);
    /* Создаем массив с удобными для нас обьектами */
     return _transformCharacter(res.data.results[0]);
  }

  const getCharacterByName = async (name) => {
    const res = await request(`${_apiBase}characters?name=${name}&${_apiKeyTemp}`);
   /* Создаем массив с удобными для нас обьектами */
    return res.data.results.map(_transformCharacter)
 }

  const getAllComics = async (offset) => {
    const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKeyTemp}`);
    return res.data.results.map(_transformComics)
  }

  const getComic = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKeyTemp}`);
		return _transformComics(res.data.results[0]);
	};

  /* Метод который переводит неудобные данные в удобный обьект */
  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      /* Обрезаем до 170 символов или если пустой пишем что описание отсутствует */
      description: char.description,
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items
    }
  }

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      description: comics.description ? comics.description.slice(0, comics.description.slice(0, 170).lastIndexOf(' ')) + '...' : "Description is missing...",
      pageCount: comics.pageCount ? `${comics.pageCount}` : "Not avialable",
      language: comics.textObjects.length > 1 ? `${comics.textObjects[0].language}` : "en-us", 
      thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
      price: comics.prices[0].price ?  `${comics.prices[0].price}$` : "Not avialable"
    }
  }

  return {loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComic, getCharacterByName }
}

export default useMarvelService;

