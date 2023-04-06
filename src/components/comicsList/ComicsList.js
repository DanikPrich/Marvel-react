import {useState, useEffect} from 'react'

import useMarvelService from '../../services/MarvelService'
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(8);
    const [comicsEnded, setComicsEnded] = useState(false)

    const {loading, error, getAllComics} = useMarvelService();

    useEffect( () => {
        onRequest(offset, true);
    }, [])
    
    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllComics(offset)
            .then(onLoaded)
    }

    const onLoaded = (newComicsList) => {
        let ended = newComicsList.length < 8 ? true : false;

        setComicsList(comicsList => [...comicsList, ...newComicsList])
        setNewItemLoading(newItemLoading => false)
        setOffset(offset => offset + 8)
        setComicsEnded(ended)

    }

    const renderItems = (comicsList) => {
        const items = comicsList.map((comics, i) => {
            const {id, thumbnail, title, price} = comics
            return (
                <li className="comics__item" key={i}>
                    <a href="#">
                        <img src={thumbnail} alt="x-men" className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </a>
                </li>
            )
        })
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        ) 
    }

    const items = renderItems(comicsList)
    
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    return (
        <div className="comics__list">
            {spinner}
            {errorMessage}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display' : comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;