import React, { useState, useContext, useRef, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, Row, Col, FormText, Spinner } from 'reactstrap';
import { useHistory, useParams } from "react-router-dom";
import { UserContext } from "../../providers/UserProvider";
import DatePicker from "reactstrap-date-picker";
import Errors from "../Errors";
import validateEmail from "../../utilities/validateEmail";
import { TherapistInfoContext } from "../../providers/TherapistInfoProvider";
import TherapistPreview from "./TherapistPreview";
import debounce from "../../utilities/debounce";

export default function RegisterClient() {
    const history = useHistory();
    const { register } = useContext(UserContext);
    const { therapistInfo, getTherapist } = useContext(TherapistInfoContext);
    const [loading, setLoading] = useState(true);

    const { code } = useParams();

    useEffect(() => {
        getTherapist(code).then(setLoading(false));
    }, []);

    const updateTherapistPreview = debounce(() => {
        if (cCode.current.value !== "") {
            setLoading(true);
            getTherapist(cCode.current.value)
                .then(setLoading(false))
        }
    }, 800);

    const firstName = useRef();
    const lastName = useRef();
    const nickName = useRef();
    const [birthday, setBirthday] = useState(null);
    const email = useRef();
    const password1 = useRef();
    const password2 = useRef();
    const cCode = useRef(); //counselor/therapist code

    const [errors, setErrors] = useState([]);

    const submitForm = (e) => {
        e.preventDefault(); //keep the form from refreshing the page
        setErrors([]); //clear out any old errors

        //check for errors
        if (firstName.current.value === "") {
            const error = "The First Name field is required.";
            setErrors(errors => [...errors, error]);
        }
        if (lastName.current.value === "") {
            const error = "The Last Name field is required.";
            setErrors(errors => [...errors, error]);
        }
        if (birthday === null) {
            const error = "Please enter your birthday.";
            setErrors(errors => [...errors, error]);
        }
        if (email.current.value === "") {
            const error = "Please enter your e-mail address.";
            setErrors(errors => [...errors, error]);
        } else if (!validateEmail(email.current.value)) {
            const error = "Please provide a valid e-mail address.";
            setErrors(errors => [...errors, error]);
        }
        if (password1.current.value === "") {
            const error = "The Password field is required.";
            setErrors(errors => [...errors, error]);
        }
        if (password1.current.value !== password2.current.value) {
            const error = "Your passwords do not match.";
            setErrors(errors => [...errors, error]);
        }
        if (cCode.current.value === "") {
            const error = "The Counselor Code field is required.";
            setErrors(errors => [...errors, error]);
        }

    }

    return (
        <div className="container mt-4">
            <h1>Create New Account</h1>
            <hr />
            <Errors errors={errors} />
            <Form onSubmit={submitForm}>
                <Row form>
                    <Col sm="6">
                        <FormGroup>
                            <Label for="firstName">First Name</Label>
                            <Input type="text" id="firstName" name="firstName" innerRef={firstName} autoFocus />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label for="lastName">Last Name</Label>
                            <Input type="text" id="lastName" name="lastName" innerRef={lastName} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col sm="6">
                        <FormGroup>
                            <Label for="nickName">Nickname <span className="text-muted font-italic">Optional</span></Label>
                            <Input type="text" id="nickName" name="nickName" innerRef={nickName} />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label for="birthday">Birthday</Label>
                            <DatePicker
                                onChange={e => setBirthday(e)}
                                value={birthday}
                                id="birthday"
                                name="birthday"
                                clearButtonElement="Clear"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                    <Label for="email">E-mail Address</Label>
                    <Input type="text" id="email" name="email" innerRef={email} />
                </FormGroup>
                <Row form>
                    <Col sm="6">
                        <FormGroup>
                            <Label for="password1">Password</Label>
                            <Input type="password" id="password1" name="password1" innerRef={password1} />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label for="password2">Verify Password</Label>
                            <Input type="password" id="password2" name="password2" innerRef={password2} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="bg-light text-dark border rounded pt-2 mt-2 mx-0">
                    <Col lg="6">
                        {
                            loading
                                ?
                                <Spinner color="sucess"></Spinner>
                                :
                                <TherapistPreview therapistInfo={therapistInfo} />
                        }
                    </Col>
                    <Col lg="6" className="align-self-center">
                        <FormGroup>
                            <hr className="d-lg-none" />
                            <Label for="cCode">Counselor Code</Label>
                            <Input
                                type="cCode"
                                id="cCode"
                                name="cCode"
                                className="text-uppercase"
                                bsSize="lg"
                                defaultValue={code}
                                innerRef={cCode}
                                onChange={updateTherapistPreview}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup className="text-right mt-4">
                    <Button type="submit" color="primary">Create Account</Button>
                </FormGroup>
            </Form>
        </div>
    );
}