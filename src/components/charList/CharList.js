import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(1541);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    /* Когда замаунтился компонент */
    useEffect(() => {
        onRequest();
    }, [])
    
    /* Метод который отвечает за запрос на сервер, первый раз вызывается при рендере */
    const onRequest = (offset) => {
        /* В первый раз вызова это ни на что не влияет, потом же мы будем кидать с помощью этого метода атрибут кнопке disabled */
        onCharListLoading();
        /* Отправляем запрос */
        marvelService
        .getAllCharacters(offset)
        /* Записываем новые поля в стейт */
        .then(onCharactersLoaded)
        /* Краш */
        .catch(onError)
    }
    
   const onCharListLoading = () => {
        setNewItemLoading(true);
    }
    
    /* Когда загрузился, записываем новых персон в стейт */
    const onCharactersLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) ended = true;
        
        /* Записываем в стейт относительно старого стейта */
        /* Конкатинируем старый массив персонажей и добавляем новых */
        setCharList(charList => [...charList, ...newCharList]);
        /* Поля записались, выключаем загрузку */
        setLoading(loading => false);
        setNewItemLoading(newItemLoading => false)
        setOffset(offset => offset + 9)
        setCharEnded(charEnded => ended)
    }
    /* При ерроре показываем еррор и останавливаем загрузку */
    const onError = () => {
        setError(true);
        setLoading(false);
    }

    /* Создаем массив пустой рефов */
    const charRefs = useRef([])



    /* Удаляем всем актив стиль и добавляем нужному, ставим фокус */
    const focusOnItem = (i) => {
        charRefs.current.forEach(item => item.classList.remove('char__item_selected'))
        charRefs.current[i].classList.add('char__item_selected')
        charRefs.current[i].focus(); 
    }

    const renderItems = (charList) => {
        /* Создаем новый массив на базе прежних */
        const items = charList.map((item,i) => {
            /* Если фото не найдено, изамени отображение картинки */
            const imgStyle = item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" 
                ? {'objectFit' : 'unset'}
                : {'objectFit' : 'cover'}

            return (
                /* Вернем массив из элементов */
                <li className="char__item" 
                /* Пушим в массив рефы айтемов */
                ref={el => charRefs.current[i] = el}
                key={item.id}
                /* При клике ставим фокус и вызываем функцию из пропса */
                onClick={() => {
                    props.onCharSelected(item.id);
                    focusOnItem(i)
                }}
                /* При нажатии ентера или е ставим фокус и вызываем ф из пропса */
                onKeyDown={(e) => {
                    if(e.key === "Enter" || e.key === 'e') {
                        props.onCharSelected(item.id); 
                        focusOnItem(i);
                    }
                }}
                /* Чтобы можно было через таб перемещаться к элементу */
                tabIndex={0}
                /* Вызываем функцию рефов и передаем выбранный элемент */
                >
                    <img src={item.thumbnail} alt="abyss" style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        /* Массив будет находится в теге и конкатинироваться внутри (добавляться по очереди) */
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(charList)

    const spinner = loading ? <Spinner/> : null
    const errorMessage = error ? <ErrorMessage/> : null
    const content = !(loading || error) ? items : null

    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            {content}
            <button 
            className="button button__main button__long"
            disabled={newItemLoading}
            style={{'display' : charEnded ? 'none' : 'block'}}
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

/* Проверяем пропс onCharSelected на обязательную функцию */
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;