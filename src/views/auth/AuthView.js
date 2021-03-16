import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { AppRoute } from '../../utils/Routes'
import { LexLogo, LexTitle } from '../../components/branding/Branding'
import './AuthView.css'

const AuthView = () => {
    const history = useHistory()
    const [loading, setLoading] = useState(false)

    const handleLogin = (e) => {
        e.preventDefault()
        setLoading(true)
        history.push(AppRoute())
    }
    
    return (
        <main className="auth__container">    
            <div className="border__top" />
            <div className="auth__column--middle">

                <div className="auth__branding">
                    <LexLogo location={"logo__login--lex"}/>
                    <LexTitle location={"title__login"} />
                    <h2 className="subtitle">
                        Create custom word collections<br/>
                        using Merriam-Webster's Collegiate<sup>&#174;</sup> Thesaurus
                    </h2>
                </div>

                <section className="card card__color--white card__auth">
                    <section className="auth__form">
                        <form
                            className="form"
                            onSubmit={handleLogin}>
                            <h3>Note:</h3>
                            <p>This is a demonstration of Lexicon's frontend.</p>
                            <p >Lexicon is not fully functioning as the backend is not running.</p>
                        
                            {/* If Loading, show spinner instead of button */}
                            {loading ? (
                                <div className="spinner__card">
                                    <div className="cls-spinner cls-spinner--card">
                                        <div className="cls-circle cls-spin"></div>
                                    </div>
                                </div>
                            ) : (
                                <fieldset className="fieldset__btn auth__submit">
                                    <button                                 
                                    disabled={loading}
                                    className="btn btn__authSubmit"
                                    type="submit">
                                        Continue
                                    </button>
                                </fieldset>
                            )}

                        </form>
                    </section>
                </section>
            </div>
            <div className="border__bottom" />
        </main>
    )
}

export default AuthView