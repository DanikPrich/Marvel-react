import { useState } from 'react';
import { Formik } from 'formik';
import {Link} from 'react-router-dom'
import * as Yup from 'yup'

import './charSearchForm.scss';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

const setContent = (process, char ) => {
    switch(process) {
        case 'waiting':
            return null
        case 'loading':
            return null
        case 'error':
            return <ErrorMessage/>
        case 'confirmed':
            return char.length > 0 ? <Result char={char}/> : <SearchError />
        default:
            throw new Error('Unexpected process state');
    }
}

const CharSearchForm = (props) => {
    
    const [char, setChar] = useState(null);

    const {getCharacterByName, clearError, process, setProcess} = useMarvelService();
    
    const onCharLoaded = (char) => {
        setChar(char)
    }

    const updateChar = async (charName) => {
        clearError()

        await getCharacterByName(charName)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    return (
        <Formik 
            initialValues={{charName: ''}}
            validationSchema={Yup.object({
                charName: Yup.string().required('This field is required'),
            })}
            onSubmit={async ({charName}, {setSubmitting}) => {
                await updateChar(charName)
                setSubmitting(false);
            }}
        >
            {({
                values, 
                errors, 
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
            }) => (
                <form className="char__search-form" onSubmit={handleSubmit}>
                    <label htmlFor="" className='char__search-label'>Or find a character by name:</label>
                    <div className='char__search-wrapper'>
                        <input 
                            type="text" 
                            name="charName" 
                            className='char__search-label' 
                            placeholder='Enter name'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.charName}
                        />  
                        <button 
                            type='submit' 
                            className="button button__main"
                            disabled={isSubmitting}
                        >
                            <div className="inner">Find</div>
                        </button>
                    </div>
                    {errors.charName && touched.charName ? <div className='char__search-error'>{errors.charName}</div> : null}
                    {setContent(process, char)}
                </form>
            )}
           
        </Formik>
    )
}

const Result = ({char}) => {

    return (
        <div className='char__search-wrapper'>
            <div className='char__search-success'>
                There is! Visit {char[0].name} page?
            </div>
            <Link to={`/char/${char[0].id}`} className="button button__secondary">
                <div className='inner'>To page</div>
            </Link>
        </div>
    )
}

const SearchError = () => (
    <div className='char__search-error'>
        The character is not found. Check the name and try again later
    </div>
)

export default CharSearchForm;