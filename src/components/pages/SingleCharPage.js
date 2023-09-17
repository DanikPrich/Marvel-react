import { Link } from 'react-router-dom';

import './SingleCharPage.scss';

const SingleComicLayout = ({data}) => {

  const {name, description, thumbnail} = data;

  return (
    <>
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

export default SingleComicLayout;