/*
    TherapistPreview.js
    This component renders the therapist info for RegisterClient.js
*/

import React from "react";
import { Row, Col } from 'reactstrap';

export default ({ therapistInfo, code }) => {
    if (code === "") {
        return <div className="h-100 d-flex align-items-center">Please type in a counselor code.</div>
    } else if (therapistInfo === null) {
        return <div className="h-100 d-flex align-items-center">No matching therapist found</div>
    } else {
        return (
            <Row className="text-center text-sm-left">
                <Col sm="3" className="align-self-center">
                    <img src={therapistInfo.avatar} alt={therapistInfo.nickName + "'s avatar"} className="avatar avatar-large mb-2" />
                </Col>
                <Col sm="auto" className="align-self-center">
                    {therapistInfo.nickName !== therapistInfo.firstName
                        ?
                        <>
                            <h4>{therapistInfo.nickName}</h4>
                            <h5>{therapistInfo.firstName} {therapistInfo.lastName}</h5>
                        </>
                        :
                        <h4>{therapistInfo.firstName} {therapistInfo.lastName}</h4>
                    }
                    <h5 className="font-italic">{therapistInfo.company}</h5>
                </Col>
            </Row>
        )
    }
}