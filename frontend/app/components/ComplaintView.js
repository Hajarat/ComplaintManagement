import React, {useState, useEffect, useContext } from "react"
import { Redirect } from "react-router-dom"
import { useCookies } from 'react-cookie'

import Axios from 'axios'

import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'


function ComplaintView() {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)

    const [cookies, setCookie] = useCookies(['Username'])

    const [complaints, setComplaints] = useState({items: []})
    const [loading, setLoading] = useState(true)
    const [redirect, setRedirect] = useState(false)

    async function getComplaints() {
        if (!cookies.Username) {
            appDispatch({type: "flashMessage", value: "You must be logged in to view your complaints."})
            setRedirect(true)
            return
        }
        const {data: response} = await Axios.get(`/api/retrieve-complaints/${cookies.Username}`)
        if (response === null) {
            appDispatch({type: "flashMessage", value: "You have no registered complaints."})
            setRedirect(true)
            return
        }
        setComplaints(() => { return {items : [...response]}})
        setLoading(false)
    }
    
    useEffect(() => {
        getComplaints()
    }, [])

    if (redirect) return <Redirect to="/" />

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
                            <li className="list-group-item">Sector: {complaint.sector}</li>
                            <li className="list-group-item">Status: <span className={complaint.complaintStatus === "Pending" ? "text-warning" : complaint.complaintStatus === "Resolved" ? "text-success" : "text-danger"}>{complaint.complaintStatus}</span></li>
                        </ul>
                    </div>)
            })}
        </div>
    )
}

export default ComplaintView