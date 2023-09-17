import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService'
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import AppBanner from "../appBanner/AppBanner";

import './SingleCharPage.scss';

const SingleComicPage = () => {
  /* Достаем переменную comicId из обьекта с параметрами */
  const { charId } = useParams();
  const [char, setChar] = useState({});

  const {loading, error, getCharacter, clearError} = useMarvelService();

  useEffect(() => {
    updateChar();

    /* Обновляем комикс при изменении айди */
    //eslint-disable-next-line
  }, [charId])

  const updateChar = () => {
      clearError();      
      getCharacter(charId)
          .then(onCharLoaded)
      
  }


  /* Когда загрузился, записываем персон в стейт */
  const onCharLoaded = (char) => {
    setChar(char);
  } 

  /* Условные отрисовки */
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null
  
  return (
    <>
      {errorMessage}
      {spinner}
      {content}
    </>
  )
  
}


const View = ({char}) => {

  const {name, description, thumbnail} = char;

  return (
    <>
      <AppBanner/>
      <div className="single-char">
          <img src={thumbnail} alt={name} className="single-char__img"/>
          <div className="single-char__info">
              <h2 className="single-char__name">{name}</h2>
              <p className="single-char__descr">{description}</p>
          </div>
          <Link to="/" className="single-char__back">Back to all</Link>
      </div>
    </>
)
}

export default SingleComicPage;