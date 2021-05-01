import React, { useContext, useEffect } from "react"
import { useCookies } from 'react-cookie'

function HeaderLoggedIn() {
    const [cookies, setCookie, removeCookie] = useCookies(['Username'])

    function handleLogout() {
        removeCookie("Username")
    }
    
    return (
        <div>
            <span className="text-white mr-3">
                Hello, {cookies.Username}
            </span>
            <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                Sign Out
            </button>
        </div>
    )
}

export default HeaderLoggedIn