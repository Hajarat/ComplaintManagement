import React, { useContext, useEffect, useState } from "react"
import { Redirect, Link } from "react-router-dom"
import { useCookies } from 'react-cookie'

import HeaderLoggedOut from "./HeaderLoggedOut"
import HeaderLoggedIn from "./HeaderLoggedIn"

function Header() {

    const [cookie, setCookie] = useCookies(['Username'])
    const [redirect, setRedirect] = useState(false)

    // Need to redirect to home page after login/logout

    if (redirect) {
        return <Redirect to="/" />
    }

    return (
        <header className="header-bar bg-primary mb-3">
            <div className="container d-flex flex-column flex-md-row align-items-center p-3">
                <h4 className="my-0 mr-md-auto font-weight-normal">
                    <Link className="text-white text-decoration-none" to="/">ABC's Complaint Manager</Link>
                </h4>
                {cookie.Username ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
            </div>
        </header>
    )
}

export default Header