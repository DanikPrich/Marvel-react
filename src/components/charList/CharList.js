import { Component } from 'react';
import PropTypes from 'prop-types'
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component{
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 1541, 
        charEnded: false,
    }

    marvelService = new MarvelService();

    /* Когда замаунтился компонент */
    componentDidMount() {
        this.onRequest()
    }
    
    /* Метод который отвечает за запрос на сервер, первый раз вызывается при рендере */
    onRequest = (offset) => {
        /* В первый раз вызова это ни на что не влияет, потом же мы будем кидать с помощью этого метода атрибут кнопке disabled */
        this.onCharListLoading();
        /* Отправляем запрос */
        this.marvelService
        .getAllCharacters(offset)
        /* Записываем новые поля в стейт */
        .then(this.onCharactersLoaded)
        /* Краш */
        .catch(this.onError)
    }
    
    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }
    
    /* Когда загрузился, записываем новых персон в стейт */
    onCharactersLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) ended = true;

        /* Записываем в стейт относительно старого стейта */
        this.setState(({offset, charList}) => ({
            /* Конкатинируем старый массив персонажей и добавляем новых */
            charList: [...charList, ...newCharList],
            /* Поля записались, выключаем загрузку */
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }
    /* При ерроре показываем еррор и останавливаем загрузку */
    onError = () => {
        this.setState({
            charList: [],
            error: true,
            loading: false
        })
    }

    /* Создаем массив пустой рефов */
    charRefs = [];

    /* Пушим в массив рефы айтемов */
    setCharRefs = (elem) => {
        this.charRefs.push(elem);
    }

    /* Удаляем всем актив стиль и добавляем нужному, ставим фокус */
    focusOnItem = (i) => {
        this.charRefs.forEach(item => item.classList.remove('char__item_selected'))
        this.charRefs[i].classList.add('char__item_selected')
        this.charRefs[i].focus(); 
    }

    renderItems = (charList) => {
        /* Создаем новый массив на базе прежних */
        const items = charList.map((item,i) => {
            /* Если фото не найдено, изамени отображение картинки */
            const imgStyle = item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" 
                ? {'objectFit' : 'unset'}
                : {'objectFit' : 'cover'}

            return (
                /* Вернем массив из элементов */
                <li className="char__item" 
                key={item.id}
                /* При клике ставим фокус и вызываем функцию из пропса */
                onClick={() => {
                    this.props.onCharSelected(item.id);
                    this.focusOnItem(i)
                }}
                /* При нажатии ентера или е ставим фокус и вызываем ф из пропса */
                onKeyDown={(e) => {
                    if(e.key === "Enter" || e.key === 'e') {
                        this.props.onCharSelected(item.id); 
                        this.focusOnItem(i);
                    }
                }}
                /* Чтобы можно было через таб перемещаться к элементу */
                tabIndex={0}
                /* Вызываем функцию рефов и передаем выбранный элемент */
                ref={this.setCharRefs}
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

    render() {
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state

        const items = this.renderItems(charList)

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
                onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

/* Проверяем пропс onCharSelected на обязательную функцию */
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;