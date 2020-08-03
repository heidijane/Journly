/*
    Login.js
    This component contains the login form. When form is submitted
    a request is made to the server to get the firebase info and match it to the
    info in the SQL server db
*/

import React, { useState, useContext } from "react";
import { Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';
import { useHistory } from "react-router-dom";
import { UserContext } from "../../providers/UserProvider";
import Errors from "../Errors";

export default function Login() {
    const history = useHistory();
    const { login } = useContext(UserContext);

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const [buttonText, setButtonText] = useState("Sign In");
    const [errors, setErrors] = useState([]);

    const loginSubmit = (e) => {
        e.preventDefault();
        setErrors([]); //clear out any old errors
        setButtonText(<Spinner size="sm" />);
        login(email, password)
            .then(() => history.push("/"))
            .catch(() => {
                setButtonText("Sign In");
                const error = "E-mail and password do not match. Please try again.";
                setErrors(errors => [...errors, error]);
            });
    };

    return (
        <Form onSubmit={loginSubmit}>
            <FormGroup>
                <Label for="email">Email</Label>
                <Input id="email" type="text" onChange={e => setEmail(e.target.value)} />
            </FormGroup>
            <FormGroup>
                <Label for="password">Password</Label>
                <Input id="password" type="password" onChange={e => setPassword(e.target.value)} />
            </FormGroup>
            <Errors errors={errors} />
            <FormGroup>
                <Button color="primary" block>{buttonText}</Button>
            </FormGroup>
        </Form>
    );
}