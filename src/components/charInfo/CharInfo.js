import { Link } from 'react-router-dom';

import { useState, useEffect} from 'react';

import PropTypes from 'prop-types'

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';

const CharInfo = (props) => {
    
    const [char, setChar] = useState(null);

    const {loading, error, getCharacter} = useMarvelService();

    useEffect(() => {
        updateChar();
        //eslint-disable-next-line
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;
        if(!charId) return;
        
        getCharacter(charId)
            .then(onCharactersLoaded)
        
    }


    /* Когда загрузился, записываем персон в стейт */
    const onCharactersLoaded = (char) => {
        setChar(char);
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
                        {/* eslint-disable-next-line */}
                        <a href={homepage} className="button button__main" target="_blank">
                            <div className="inner">homepage</div>
                        </a>
                        {/* eslint-disable-next-line */}
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
                        const comicURI = item.resourceURI
                        let comicId = comicURI.substring(comicURI.lastIndexOf("/") + 1);
                        // eslint-disable-next-line
                        if (i >= 10) return; 
                        return (
                            <li key={i}>
                                <Link to={`/comics/${comicId}`} className="char__comics-item">{item.name}</Link>
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