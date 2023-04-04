import { Component } from 'react';

import PropTypes from 'prop-types'

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';
import MarvelService from '../../services/MarvelService';

class CharInfo extends Component {
    
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if(this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    updateChar = () => {
        const {charId} = this.props;
        if(!charId) return;
        
        this.onCharLoading();

        this.marvelService
            .getCharacter(charId)
            .then(this.onCharactersLoaded)
            .catch(this.onError)
        
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    /* Когда загрузился, записываем персон в стейт */
    onCharactersLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }
    /* При ерроре показываем еррор и останавливаем загрузку */
    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    
    render() {
        const {char, loading, error} = this.state;

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