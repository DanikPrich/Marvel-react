import { useState } from 'react';
import { Formik } from 'formik';
import {Link} from 'react-router-dom'
import * as Yup from 'yup'

import './charSearchForm.scss';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';


const CharSearchForm = (props) => {
    
    const [char, setChar] = useState(null);

    const {loading, error, getCharacterByName, clearError} = useMarvelService();
    
    const onCharLoaded = (char) => {
        setChar(char)
    }

    const updateChar = (charName) => {
        clearError()

        getCharacterByName(charName)
            .then(onCharLoaded)
    }

    const result = !char ? null : char.length > 0 ? 
        <div className='char__search-wrapper'>
            <div className='char__search-success'>
                There is! Visit {char[0].name} page?
            </div>
            <Link to={`/char/${char[0].id}`} className="button button__secondary">
                <div className='inner'>To page</div>
            </Link>
        </div> : 
        <div className='char__search-error'>
            The character is not found. Check the name and try again later
        </div>

    const errorMessage = error ? <div className='char__search-critical-error'><ErrorMessage/></div> : null
    return (
        <Formik 
            initialValues={{charName: ''}}
            validationSchema={Yup.object({
                charName: Yup.string().required('This field is required'),
            })}
            onSubmit={async ({charName}) => {
                updateChar(charName)
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
                            disabled={loading}
                        >
                            <div className="inner">Find</div>
                        </button>
                    </div>
                    {errors.charName && touched.charName ? <div className='char__search-error'>{errors.charName}</div> : null}
                    {result}
                    {errorMessage}
                </form>
            )}
           
        </Formik>
    )
}

export default CharSearchForm;