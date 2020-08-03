import React from "react"
import { Link } from "react-router-dom"

export default function HealthResources() {
    return (
        <>
            <h4>Mental Health Resources</h4>
            <div className="lead">
                <span className="font-weight-bold">Call 911</span> if you or someone you know is in immediate danger or go to the nearest emergency room.
            </div>
            <hr />
            <div>
                <a href="http://suicidepreventionlifeline.org/" target="_blank"><h5>National Suicide Prevention Lifeline</h5></a>
                <h5>Call 1-800-273-TALK (8255); En Español 1-888-628-9454</h5>
            </div>
            <div className="mt-3">
                <a href="http://www.crisistextline.org/" target="_blank"><h5>Crisis Text Line</h5></a>
                <h5>Text “HELLO” to 741741</h5>
            </div>
            <div className="mt-3">
                <a href="https://www.samhsa.gov/find-help/disaster-distress-helpline" target="_blank"><h5>Disaster Distress Helpline</h5></a>
                <h5>Call 1-800-985-5990 or text “TalkWithUs” to 66746</h5>
            </div>
            <div className="mt-3">
                <a href="https://www.veteranscrisisline.net/" target="_blank"><h5>Veterans Crisis Line</h5></a>
                <h5>Call 1-800-273-TALK (8255) and press 1 or text to 838255</h5>
            </div>
            <hr />
            <a href="https://www.nimh.nih.gov/health/find-help/index.shtml" target="_blank"><h5>More Resources</h5></a>
        </>
    )
}