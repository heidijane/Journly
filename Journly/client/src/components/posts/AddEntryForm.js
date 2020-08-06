/*
    AddEntryForm.js
    This component renders the add new journal entry form.
    When the form is submitted a new post is sent to the back end.
    If the new post has a flagged word the mental health resources modal will be shown.
*/

import React, { useState, useRef, useContext } from "react";
import { Form, FormGroup, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useHistory } from "react-router-dom";
import MoodSelector from "./MoodSelector";
import "./AddEntryForm.css"
import Errors from "../Errors";
import { PostContext } from "../../providers/PostProvider";
import HealthResources from "../HealthResources";
import TextEditor from "./TextEditor"

export default function AddEntryForm() {
    const { addPost } = useContext(PostContext);
    const [selectedMood, setSelectedMood] = useState(null);
    const [errors, setErrors] = useState([]);
    const history = useHistory();

    //for the mental health resources modal
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [content, setContent] = useState("");

    //validates form fields and submits new post to the server
    const submitForm = e => {
        e.preventDefault();
        setErrors([]); //clear out any old errors

        if (selectedMood === null) {
            const error = "You must select a mood icon to represent how you are feeling!";
            setErrors(errors => [...errors, error]);
        } else {
            const post = {
                moodId: selectedMood.id,
                content: (content === "" ? null : content)
            };

            addPost(post)
                .then(resp => {
                    //if the new post has been flagged by the server show the mental health resources modal
                    //otherwise direct to their post list
                    if (resp.flagged === true) {
                        toggle();
                    } else {
                        history.push("/myentries")
                    }
                })
        }

    }

    return (
        <>
            <div className="container py-4">
                <Form onSubmit={e => submitForm(e)}>
                    <FormGroup>
                        <h2>I'm feeling{selectedMood ? <img src={"emoji/" + selectedMood.image + ".svg"} alt={selectedMood.name} className="selectedMood" /> : "..."}</h2>
                        <MoodSelector selectedMood={selectedMood} setSelectedMood={setSelectedMood} />
                    </FormGroup>
                    <FormGroup>
                        <h2>What's going on? <span className="font-italic text-muted">Optional</span></h2>
                        <TextEditor content={content} setContent={setContent} />
                    </FormGroup>
                    <Errors errors={errors} />
                    <FormGroup className="text-right">
                        <Button type="submit" color="primary">Create New Entry</Button>
                    </FormGroup>
                </Form>
            </div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Remember we are here for you!</ModalHeader>
                <ModalBody>
                    <HealthResources />
                </ModalBody>
                <ModalFooter className="text-right">
                    <Button color="primary" onClick={() => history.push("/myentries")}>Continue</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}