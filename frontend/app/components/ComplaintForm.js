import React, { useEffect, useState, useContext } from "react"
import { Redirect } from "react-router-dom"
import { useCookies } from 'react-cookie'

import Axios from 'axios'

import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

function ComplaintForm() {

    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)

    const [cookies, setCookie] = useCookies(['Username'])
    
    const [redirect, setRedirect] = useState(false)

    const [sector, setSector] = useState("A")
    const [option1Checked, setOption1Checked] = useState(false)
    const [option2Checked, setOption2Checked] = useState(false)
    const [option3Checked, setOption3Checked] = useState(false)
    const [option4Checked, setOption4Checked] = useState(false)
    const [complaintTitle, setComplaintTitle] = useState()
    const [complaintBody, setComplaintBody] = useState()

    async function basicChecks() {
        if (!cookies.Username) {
            appDispatch({type: "flashMessage", value: "You must be logged in to send a complaint."})
            return false
        }
        if (!complaintTitle || !complaintBody) {
            appDispatch({type: "flashMessage", value: "You must fill in all fields."})
            return false
        }
        return true
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const basicCheckSuccessful = await basicChecks()
        if (!basicCheckSuccessful) return
        try {
            const response = await Axios.post('/api/send-complaint', {
                username: cookies.Username,
                sector, option1Checked, option2Checked, option3Checked,option4Checked, complaintTitle, complaintBody
            })
            if (response.data.error) {
                appDispatch({type: "flashMessage", value: response.data.error})
            }
            if (response.data.message) { // Successful insertion occured here
                appDispatch({type: "flashMessage", value: response.data.message})
                    setRedirect(true)
            }
        } catch (e) {
            appDispatch({type: "flashMessage", value: "Error communicating with the backend."})
        }
    }

    if (redirect) {
        return <Redirect to="/" />
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted" htmlFor="sector">Please select the sector you work with</label>
                <select className="form-control form-select" id="sector" name="sector" onChange={e => setSector(e.target.value)}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>
            </div>

            <div className="form-group">
                <span className="text-muted">Please Select what applies</span><br/>

                <div className="custom-control custom-checkbox">
                    <input className="custom-control-input" checked={option1Checked} onChange={() => setOption1Checked(!option1Checked)} type="checkbox" id="option1" name="option1" value="option1" />
                    <label className="text-muted custom-control-label" htmlFor="option1">Option 1</label>
                </div>

                <div className="custom-control custom-checkbox">
                    <input className="custom-control-input" checked={option2Checked} onChange={() => setOption2Checked(!option2Checked)} type="checkbox" id="option2" name="option2" value="option2" />
                    <label className="text-muted custom-control-label" htmlFor="option2">Option 2</label>
                </div>

                <div className="custom-control custom-checkbox">
                    <input className="custom-control-input" checked={option3Checked} onChange={() => setOption3Checked(!option3Checked)} type="checkbox" id="option3" name="option3" value="option3" />
                    <label className="text-muted custom-control-label" htmlFor="option3">Option 3</label>
                </div>

                <div className="custom-control custom-checkbox">
                    <input className="custom-control-input" checked={option4Checked} onChange={() => setOption4Checked(!option4Checked)} type="checkbox" id="option4" name="option4" value="option4" />
                    <label className="text-muted custom-control-label" htmlFor="option4">Option 4</label>
                </div>
            </div>

            <br /><br />

            <div className="form-group">
                <label className="text-muted" htmlFor="complaintTitle">Complaint Title</label>
                <input className="form-control" type="text" id="complaintTitle" onChange={e => setComplaintTitle(e.target.value)} />
            </div>

            <div className="form-group">
                <label className="text-muted" htmlFor="complaintBody">Description</label>
                <textarea className="form-control" id="complaintBody" rows="3" onChange={e => setComplaintBody(e.target.value)} />
            </div>

            <button type="submit" className="py-3 mt-4 btn btn-sm btn-success btn-block">
                Submit Complaint
            </button>
            
        </form>
    )
}

export default ComplaintForm