import { Link } from 'react-router-dom';

import { useState, useEffect} from 'react';

import PropTypes from 'prop-types'

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = (props) => {
    
    const [char, setChar] = useState(null);

    const {getCharacter, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
        //eslint-disable-next-line
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;
        if(!charId) return;
        
        getCharacter(charId)
            .then(onCharactersLoaded)
            .then(() => setProcess('confirmed'))
        
    }


    /* Когда загрузился, записываем персон в стейт */
    const onCharactersLoaded = (char) => {
        setChar(char);
    }
    

    return (
        <div className="char__info">
            {/* {skeleton}
            {errorMessage}
            {spinner}
            {content} */}

            {setContent(process, View, char)}
        </div>
    )
}

/* Это глупый компонент который работает только с пропсами и вырисовывает то что нужно */
const View = ({data}) => {
    
    const {name, description, thumbnail, homepage, wiki, comics} = data

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
                {description ? description.slice(0, description.slice(0, 170).lastIndexOf(' ')) + '...' : "Description is missing..."}
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