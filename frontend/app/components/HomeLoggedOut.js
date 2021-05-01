import React, { useEffect } from "react"
import { Link } from 'react-router-dom'

function HomeLoggedOut() {
    return (
        <div className="huge-margin-below">
            <h2>Everyone has a right to complain.</h2>
            Not Registered? <Link to="/register">Register Here</Link>
        </div>
    )
}

export default HomeLoggedOut