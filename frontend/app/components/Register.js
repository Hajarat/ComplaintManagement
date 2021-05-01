import React, { useContext, useEffect, useState } from "react"
import { Redirect } from "react-router-dom"
import Axios from 'axios'

import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

function Register() {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)

    const [redirect, setRedirect] = useState(false)
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [privelege, setPrivilege] = useState("user")

    async function basicChecks() {
        if (!username || !password || !email) {
            appDispatch({type: "flashMessage", value: "You must fill in all fields."})
            return false
        }
        if (username.length < 4 || username.length > 12) {
            appDispatch({type: "flashMessage", value: "You need to provide a username with 4 to 12 characters."})
            return false
        }
        if (!validateEmail(email)) {
            appDispatch({type: "flashMessage", value: "You need to provide a valid email."})
            return false
        }
        if (password.length < 8) {
            appDispatch({type: "flashMessage", value: "Your password must be at least 8 characters."})
            return false
        }
        return true
    }

    async function attemptRegistration() {
        try {
            const response = await Axios.post('/api/register', {username, password, email})
            if (response.data.error) {
                appDispatch({type: "flashMessage", value: response.data.error})
            }
            if (response.data.message) { // Successful insertion occured here
                appDispatch({type: "flashMessage", value: response.data.message})
                setRedirect(true)
            }
        } catch(e) {
            console.log("There was an error.")
        }
    }

    // This function deals with checking the user input for the registration form and completes registration if no flag is raised
    async function handleSubmit(e) {
        e.preventDefault()
        basicChecks().then((basicCheckSuccessful) => {
            if (basicCheckSuccessful) {
                if (privelege === "user") attemptRegistration()
            }
        })

        
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    if (redirect) {
        return <Redirect to="/" />
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="username-register" className="text-muted">
                    <small>Username</small>
                </label>
                <input onChange={e => setUsername(e.target.value)} id="username-register" name="username" className="form-control" type="text"
                    placeholder="Pick a username" />
            </div>
            <div className="form-group">
                <label htmlFor="email-register" className="text-muted">
                    <small>Email</small>
                </label>
                <input onChange={e => setEmail(e.target.value)} id="email-register" name="email" className="form-control" type="text"
                    placeholder="you@example.com" />
            </div>
            <div className="form-group">
                <label htmlFor="password-register" className="text-muted">
                    <small>Password</small>
                </label>
                <input onChange={e => setPassword(e.target.value)} id="password-register" name="password" className="form-control" type="password"
                    placeholder="Create a password" />
            </div>
            <div className="form-group">
                <label htmlFor="privilege" className="text-muted">
                    <small>User Type</small>
                </label>
                <select className="form-control form-select" id="privilege" name="privilege" onChange={e => setPrivilege(e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-sm btn-success btn-block">
                Sign up for Complaint Manager
            </button>
        </form>
    )
}

export default Register