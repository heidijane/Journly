import React, { useContext, useEffect, useState, useRef } from "react"
import {
    Form,
    FormGroup,
    Spinner,
    Label,
    Input,
    Button
} from "reactstrap"
import { UserContext } from "../../providers/UserProvider";
import DatePicker from "reactstrap-date-picker";
import Errors from "../Errors";
import { useHistory, useLocation } from 'react-router-dom';

export default function UpdateUserForm({ toggle }) {

    const { getUserData, updateUser } = useContext(UserContext);
    const [userData, setUserData] = useState(null);
    const [errors, setErrors] = useState([]);

    let location = useLocation();
    const history = useHistory();

    const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);

    useEffect(() => {
        getUserData(currentUser.firebaseUserId).then(setUserData);
    }, [])

    const firstName = useRef();
    const lastName = useRef();
    const nickName = useRef();
    const [birthday, setBirthday] = useState(null);
    const company = useRef();

    //validate and submit the form
    const submitForm = e => {
        e.preventDefault();
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
        if (userData.userTypeId === 1) {
            if (company.current.value === "") {
                const error = "Please input your school, company, or organization.";
                setErrors(errors => [...errors, error]);
                errorTrigger = true;
            }
        }

        if (errorTrigger === false) {
            userData.firstName = firstName.current.value;
            userData.lastName = lastName.current.value;
            userData.nickName = (nickName.current.value === "" ? firstName.current.value : nickName.current.value);

            if (birthday !== null) {
                userData.birthday = birthday;
            }

            if (userData.userTypeId === 1) {
                userData.therapistInfo.company = company.current.value;
            }

            updateUser(userData)
                .then(toggle)
                .then(() => {
                    //refreshes the current route to reflect the deletion
                    history.push({ pathname: "/empty" });
                    history.replace({ pathname: location.pathname })
                });
        }
    }

    if (userData === null) {
        return <Spinner />
    } else {
        return (
            <Form onSubmit={e => submitForm(e)}>
                <FormGroup>
                    <Label for="firstName">First Name</Label>
                    <Input type="text" id="firstName" name="firstName" innerRef={firstName} defaultValue={userData.firstName} />
                </FormGroup>

                <FormGroup>
                    <Label for="lastName">Last Name</Label>
                    <Input type="text" id="lastName" name="lastName" innerRef={lastName} defaultValue={userData.lastName} />
                </FormGroup>
                <FormGroup>
                    <Label for="nickName">Nickname <span className="text-muted font-italic">Optional</span></Label>
                    <Input type="text" id="nickName" name="nickName" innerRef={nickName} defaultValue={userData.nickName} />
                </FormGroup>
                <FormGroup>
                    <Label for="birthday">Birthday</Label>
                    <DatePicker
                        onChange={e => setBirthday(e)}
                        value={userData.birthday}
                        id="birthday"
                        name="birthday"
                        clearButtonElement="Clear"
                    />
                </FormGroup>
                {
                    userData.userTypeId === 1 &&
                    <FormGroup>
                        <Label for="company">School, Company, or Organization</Label>
                        <Input type="text" id="company" name="company" innerRef={company} defaultValue={userData.therapistInfo.company} />
                    </FormGroup>
                }
                <FormGroup>

                </FormGroup>
                <Errors errors={errors} />
                <FormGroup className="text-right">
                    <Button type="button" color="secondary" onClick={toggle}>Cancel</Button>
                    <Button type="submit" color="primary" className="ml-2">Submit</Button>
                </FormGroup>
            </Form>
        )
    }

}