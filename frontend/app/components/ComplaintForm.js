import React, { useEffect, useState } from "react"

function ComplaintForm() {

    const [sector, setSector] = useState("A")
    
    const [option1Checked, setOption1Checked] = useState(false)
    const [option2Checked, setOption2Checked] = useState(false)
    const [option3Checked, setOption3Checked] = useState(false)
    const [option4Checked, setOption4Checked] = useState(false)

    const [complaintTitle, setComplaintTitle] = useState()
    const [complaintBody, setComplaintBody] = useState()

    function handleSubmit() {

    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="sector" className="text-muted">Please select the sector you work with</label>
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
                    <input className="custom-control-input" checked={option1Checked} onClick={() => setOption1Checked(!option1Checked)} type="checkbox" id="option1" name="option1" value="option1" />
                    <label htmlFor="option1" className="text-muted custom-control-label">Option 1</label>
                </div>

                <div className="custom-control custom-checkbox">
                    <input className="custom-control-input" checked={option2Checked} onClick={() => setOption2Checked(!option2Checked)} type="checkbox" id="option2" name="option2" value="option2" />
                    <label htmlFor="option2" className="text-muted custom-control-label">Option 2</label>
                </div>

                <div className="custom-control custom-checkbox">
                    <input className="custom-control-input" checked={option3Checked} onClick={() => setOption3Checked(!option3Checked)} type="checkbox" id="option3" name="option3" value="option3" />
                    <label htmlFor="option3" className="text-muted custom-control-label">Option 3</label>
                </div>

                <div className="custom-control custom-checkbox">
                    <input className="custom-control-input" checked={option4Checked} onClick={() => setOption4Checked(!option4Checked)} type="checkbox" id="option4" name="option4" value="option4" />
                    <label htmlFor="option4" className="text-muted custom-control-label">Option 4</label>
                </div>

            </div>

            <div className="form-group">
                
            </div>

            <div className="form-group">
                
            </div>

            <button type="submit" className="py-3 mt-4 btn btn-sm btn-success btn-block">
                Submit Complaint
            </button>
            
        </form>
    )
}

export default ComplaintForm