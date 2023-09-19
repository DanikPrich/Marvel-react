import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import { Transition, TransitionGroup } from 'react-transition-group';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    /* Когда замаунтился компонент */
    useEffect(() => {
        onRequest(offset, true);
    }, [])
    
    /* Метод который отвечает за запрос на сервер, первый раз вызывается при рендере */
    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        /* Отправляем запрос */
        getAllCharacters(offset)
            /* Записываем новые поля в стейт */
            .then(onCharactersLoaded)
    }
    
    /* Когда загрузился, записываем новых персон в стейт */
    const onCharactersLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) ended = true;
        
        /* Записываем в стейт относительно старого стейта */
        /* Конкатинируем старый массив персонажей и добавляем новых */
        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false)
        setOffset(offset => offset + 9)
        setCharEnded(charEnded => ended)
    }

    /* Создаем массив пустой рефов */
    const charRefs = useRef([])

    /* Удаляем всем актив стиль и добавляем нужному, ставим фокус */
    const focusOnItem = (i) => {
        charRefs.current.forEach(item => item.classList.remove('char__item_selected'))
        charRefs.current[i].classList.add('char__item_selected')
        charRefs.current[i].focus(); 
    }

    const duration = 200;

    // дефолтные стили которые устанавливают длительность  
    const defaultStyle = {
        transition: `all ${duration}ms ease-in-out`,
        opacity: 0,
        visibility: 'hidden'
    }

    //Стили которые будут на переходных этапах
    //здесь описаны четыре состояния для появления и исчезновения
    // используем visibility потому что display none/block нельзя анимировать
    const transitionStyles = {
        entering: { opacity: 0, visibility: 'hidden' },
        entered: { opacity: 1, visibility: 'visible' },
        exiting: { opacity: 1, visibility: 'visible' },
        exited: { opacity: 0, visibility: 'hidden' },
    }

    const renderItems = (charList) => {
        /* Создаем новый массив на базе прежних */
        const items = charList.map((item,i) => {
            /* Если фото не найдено, изамени отображение картинки */
            const imgStyle = item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" 
                ? {'objectFit' : 'unset'}
                : {'objectFit' : 'cover'}

            /* Вернем массив из элементов */
            return (
                <Transition 
                    timeout={duration} 
                    key={item.id}
                >
                    {(state) => {
                        return (
                        <li className="char__item" 
                        style={{
                            ...defaultStyle,
                            ...transitionStyles[state]
                        }}
                        /* Пушим в массив рефы айтемов */
                        ref={el => charRefs.current[i] = el}
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
                    )}}
                </Transition>
            )
        })
        /* Массив будет находится в теге и конкатинироваться внутри (добавляться по очереди) */
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    const items = renderItems(charList)

    const spinner = loading && !newItemLoading ? <Spinner/> : null
    const errorMessage = error ? <ErrorMessage/> : null
    // const content = !(loading || error) ? items : null

    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            {items}
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