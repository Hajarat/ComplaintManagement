import React, { useContext, useEffect, useState } from "react"

import Axios from 'axios'
import { useCookies } from 'react-cookie'

import DispatchContext from '../DispatchContext'

function HeaderLoggedOut() {
    const appDispatch = useContext(DispatchContext)

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    const [cookies, setCookie] = useCookies(['Username'])
    
    async function handleSubmit(e) {
        e.preventDefault()
        const response = await Axios.post('/api/login', {username, password})
        if (response.data.error) {
            appDispatch({type: "flashMessage", value: response.data.error})
        }
        if (response.data.message) {
            appDispatch({type: "flashMessage", value: response.data.message})
            setCookie('Username', username, {path: '/'})
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
            <div className="row align-items-center">
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text"
                        placeholder="Username" autoComplete="off" />
                </div>
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password"
                        placeholder="Password" />
                </div>
                <div className="col-md-auto">
                    <button className="btn btn-success btn-sm">Sign In</button>
                </div>
            </div>
        </form>
    )
}

export default HeaderLoggedOut