import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import {Link, NavLink} from 'react-router-dom'
import * as Yup from 'yup'

import './charSearchForm.scss';
import useMarvelService from '../../services/MarvelService';

const CharSearchForm = (props) => {
    
    const [char, setChar] = useState(null);

    const {loading, error, getCharacter, getCharacterByName} = useMarvelService();
    
    const updateChar = ({charName}) => {
        getCharacterByName(charName)
            .then(onCharLoaded)
    }

    const onCharLoaded = (res) => {
        setChar(res)
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

    return (
        <Formik 
            initialValues={{charName: '', char: null}}
            validationSchema={Yup.object({
                charName: Yup.string().required('This field is required'),
            })}
            onSubmit={async ({charName}, {setSubmitting}) => {

                // const res = await getCharacterByName(values.name)
                // console.log(res)
                // setSubmitting(false)

                // setChar(res)
                updateChar({charName})
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
                </form>
            )}
           
        </Formik>
    )
}

export default CharSearchForm;