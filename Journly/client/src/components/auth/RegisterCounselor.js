/*
    RegisterCounselor.js
    This component contains the register therapist form.
    In the future I may want to implement some type of verification to make sure user is a real therapist, but for now this simple form will work
*/

import React, { useState, useContext, useRef } from "react";
import { Button, Form, FormGroup, Label, Input, Row, Col, Spinner } from 'reactstrap';
import { useHistory } from "react-router-dom";
import { UserContext } from "../../providers/UserProvider";
import DatePicker from "reactstrap-date-picker";
import Errors from "../Errors";
import validateEmail from "../../utilities/validateEmail";

export default function RegisterClient() {
    const history = useHistory();
    const { register } = useContext(UserContext);

    const [buttonText, setButtonText] = useState("Create Account");

    const firstName = useRef();
    const lastName = useRef();
    const nickName = useRef();
    const [birthday, setBirthday] = useState(null);
    const company = useRef();
    const email = useRef();
    const password1 = useRef();
    const password2 = useRef();

    const [errors, setErrors] = useState([]);

    //validate the form fields and then register the therapist
    const registerUser = (e) => {
        e.preventDefault(); //keep the form from refreshing the page
        setErrors([]); //clear out any old errors

        let errorTrigger = false;

        //check for errors
        if (firstName.current.value === "") {
            const error = "The First Name field is required.";
            setErrors(errors => [...errors, error]);
            errorTrigger = true;
        }
        if (lastName.current.value === "") {
            const error = "The Last Name field is required.";
            setErrors(errors => [...errors, error]);
            errorTrigger = true;
        }
        if (birthday === null) {
            const error = "Please enter your birthday.";
            setErrors(errors => [...errors, error]);
            errorTrigger = true;
        }
        if (company.current.value === "") {
            const error = "Please input your school, company, or organization.";
            setErrors(errors => [...errors, error]);
            errorTrigger = true;
        }
        if (email.current.value === "") {
            const error = "Please enter your e-mail address.";
            setErrors(errors => [...errors, error]);
            errorTrigger = true;
        } else if (!validateEmail(email.current.value)) {
            const error = "Please provide a valid e-mail address.";
            setErrors(errors => [...errors, error]);
            errorTrigger = true;
        }
        if (password1.current.value === "") {
            const error = "The Password field is required.";
            setErrors(errors => [...errors, error]);
            errorTrigger = true;
        }
        if (password1.current.value !== password2.current.value) {
            const error = "Your passwords do not match.";
            setErrors(errors => [...errors, error]);
            errorTrigger = true;
        }

        if (!errorTrigger) {
            setButtonText(<Spinner size="sm" />);

            const userData = {
                firstName: firstName.current.value,
                lastName: lastName.current.value,
                nickName: (nickName.current.value === "" ? firstName.current.value : nickName.current.value),
                birthday: birthday,
                email: email.current.value,
                userTypeId: 1,
                therapistInfo: { company: company.current.value }
            }

            register(userData, password1.current.value)
                .then(() => history.push("/"));
        }
    }

    return (
        <div className="container mt-4">
            <h1>Create a New Counselor or Therapist Account</h1>
            <hr />
            <Errors errors={errors} />
            <Form onSubmit={registerUser}>
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
                    <Label for="company">School, Company, or Organization</Label>
                    <Input type="text" id="company" name="company" innerRef={company} />
                </FormGroup>
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

                <FormGroup className="text-right">
                    <Button type="submit" color="primary">{buttonText}</Button>
                </FormGroup>
            </Form>
        </div>
    );
}