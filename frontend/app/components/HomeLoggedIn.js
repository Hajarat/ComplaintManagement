import React, { useEffect } from "react"
import { Link } from "react-router-dom"

function HomeLoggedIn() {
    return (
        <div>
            <h2>What would you like to do?</h2>
            <ul>
                <li><Link className="text-decoration-none" to="/complaint">Send a complaint</Link></li>
                <li>View your complaints</li>
            </ul>
        </div>
    )
}

export default HomeLoggedIn