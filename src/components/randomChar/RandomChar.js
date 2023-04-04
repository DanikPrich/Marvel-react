import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

/* Умный компонент, записывает стор и работает с логикой */
class RandomChar extends Component {

    state = {
        char: {},
        loading: true,
        error: false
    }

    componentDidMount() {
        this.updateChar();
    }

    marvelService = new MarvelService();

    /* Запись персонажа в стор */
    onCharLoaded = (char) => {
        this.setState({
            char, loading: false
        })
    }

    /* При ошибке прекращает загрузку и показывает ошибку */
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }
    /* Отправляет запрос на рандомного персонажа с рандомным айди, записывает в стор и если ошибка кидает ошибку */
    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    onReloadChar = () => {
        this.setState({
            loading: true
        })
        this.updateChar();
    }


    render() {
        const {char, loading, error} = this.state;

        /* Условные отрисовки */
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main"
                    onClick={this.onReloadChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

/* "Глупый компонент отрисовки, берет данные только из пропсов.*/
const View = ({char}) => {

    const {name, description, thumbnail, homepage, wiki} = char

    const imgNotFoud = thumbnail.indexOf('image_not_available') > 0

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgNotFoud ? {objectFit:"contain"} : null}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main" target="_blank">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary" target="_blank">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;