import React, { useEffect, useState, useContext } from "react"
import { Redirect } from "react-router-dom"
import { useCookies } from 'react-cookie'

import Axios from 'axios'

import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

function AdminComplaintReview() {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)

    const [cookies, setCookie] = useCookies(['Username'])

    const [complaints, setComplaints] = useState({items: []})
    const [loading, setLoading] = useState(true)
    const [redirect, setRedirect] = useState(false)
    const [resolveRedirect, setResolveRedirect] = useState(false)

    async function getComplaints() {
        if (!cookies.Username) {
            appDispatch({type: "flashMessage", value: "You must be logged in as an Admin to review complaints."})
            setRedirect(true)
            return
        }
        const response = await Axios.get(`/api/retrieve-all-pending-complaints/${cookies.Username}`)
        if (response.data === null) {
            appDispatch({type: "flashMessage", value: "There are no complaints to review."})
            setRedirect(true)
            return
        }
        if (response.error) {
            appDispatch({type: "flashMessage", value: response.error})
        }
        setComplaints(() => { return {items : [...response.data]}})
        setLoading(false)
    }

    useEffect(() => {
        getComplaints()
    }, [])

    async function resolve(id, resolve) {
        const response = await Axios.post('/api/handle-complaint', {id, action: resolve ? "resolve" : "dismiss"})
        window.scrollTo(0, 0)
        if (response.data.error) {
            appDispatch({type: "flashMessage", value: response.data.error})
        }
        if (response.data.message) {
            appDispatch({type: "flashMessage", value: response.data.message})
            setResolveRedirect(true)  
        }
    }

    if (redirect) return <Redirect to="/" />

    if (resolveRedirect) return <Redirect to="/complaint-handle" />

    if (loading) return <h2>Loading...</h2>

    return (
        <div className="grid-container">
            {complaints.items.map(complaint => {
                return (
                    <div className="card" key={complaint._id}>
                        <div className="card-body">
                            <h5 className="card-title">{complaint.complaintTitle}</h5>
                            <p className="card-text">{complaint.complaintBody}</p>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">User: {complaint.username}</li>
                            <li className="list-group-item">Sector: {complaint.sector}</li>
                            <li className="list-group-item"><button className="btn btn-success" onClick={() => {
                                resolve(complaint._id, true)
                            }}>Resolve</button> <button className="btn btn-danger" onClick={() => {
                                resolve(complaint._id, false)
                            }}>Dismiss</button></li>
                        </ul>
                    </div>
                )
            })}
        </div>
    )
}

export default AdminComplaintReview