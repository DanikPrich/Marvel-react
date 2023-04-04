import { useState, useEffect } from 'react';

import PropTypes from 'prop-types'

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';
import MarvelService from '../../services/MarvelService';

const CharInfo = (props) => {
    
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar();
    }, [])

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;
        if(!charId) return;
        
        onCharLoading();

        marvelService
            .getCharacter(charId)
            .then(onCharactersLoaded)
            .catch(onError)
        
    }

    const onCharLoading = () => {
        setLoading(true)
    }

    /* Когда загрузился, записываем персон в стейт */
    const onCharactersLoaded = (char) => {
        setChar(char);
        setLoading(false);
    }
    /* При ерроре показываем еррор и останавливаем загрузку */
    const onError = () => {
        setError(true)
        setLoading(false)
    }
    
    /* Условные отрисовки */
    const skeleton = char || loading || error ? null : <Skeleton/>
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

/* Это глупый компонент который работает только с пропсами и вырисовывает то что нужно */
const View = ({char}) => {
    

    const {name, description, thumbnail, homepage, wiki, comics} = char

    const imgStyle = thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" 
        ? {'objectFit' : 'contain'}
        : {'objectFit' : 'cover'}
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main" target="_blank">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary" target="_blank">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                    comics.length > 0 ? null : "There is no comics with that character..."
                }
                {
                    comics.map((item, i) => {
                        // eslint-disable-next-line
                        if (i >= 10) return; 
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    }) 
                    
                }
               
            </ul>
        </>
    )
} 

/* Используем проптайпс на компоненте чар инфо */
CharInfo.propTypes = {
    /* Берем пропс который нужно проверять, и проверяем его на число */
    charId: PropTypes.number
}

export default CharInfo;