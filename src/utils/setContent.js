import Spinner from '../components/spinner/Spinner';
import ErrorMessage from '../components/errorMessage/ErrorMessage';
import Skeleton from '../components/skeleton/Skeleton';

const setContent = (process, Component, data ) => {
  switch(process) {
      case 'waiting':
          return <Skeleton/>
      case 'loading':
          return <Spinner/>
      case 'error':
          return <ErrorMessage/>
      case 'confirmed':
          return <Component data={data}/>
      default:
          throw new Error('Unexpected process state');
  }
}

export default setContent;