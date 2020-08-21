import React, { useState, useEffect } from 'react'
import UserGuest from './UserGuest'
import UserLogged from './UserLogged'
import Loading from '../../components/Loading'
import fb from '../../utils/firebase'

export default function Account() {
    const [login, setLogin] = useState(null);

    useEffect(() => {
        fb.auth.onAuthStateChanged(user => {
            !user ? setLogin(false) : setLogin(true);
        })
    }, []);

    if (login === null) return <Loading isVisible text="Cargando" />

    return login ? <UserLogged /> : <UserGuest />
}
