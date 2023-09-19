import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import setContent from '../../utils/setContent';

import useMarvelService from '../../services/MarvelService'
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from "../appBanner/AppBanner";

const SinglePage = ({Component, dataType}) => {
  /* Достаем переменную comicId из обьекта с параметрами */
  const { id } = useParams();
  const [data, setData] = useState({});
  const {loading, error, getComic, getCharacter, clearError, process, setProcess} = useMarvelService();

  useEffect(() => {
    updateData();

    //eslint-disable-next-line
  }, [id])

  const updateData = () => {
      clearError();     
      
      switch (dataType) {
        case 'comic': 
          getComic(id).then(onDataLoaded).then(() => setProcess('confirmed'))
          break;
        case 'character':
          getCharacter(id).then(onDataLoaded).then(() => setProcess('confirmed'))
          break;
        default: 
          break;
      }
  }


  const onDataLoaded = (data) => {
    setData(data);
  } 

  
  return (
    <>
      <AppBanner/>
      {setContent(process, Component, data)}
    </>
  )
  
}

export default SinglePage;