import React, { useState, useRef, useContext } from "react";
import { Form, FormGroup, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useHistory } from "react-router-dom";
import MoodSelector from "./MoodSelector";
import "./AddEntryForm.css"
import Errors from "../Errors";
import { PostContext } from "../../providers/PostProvider";
import HealthResources from "../HealthResources";

export default function AddEntryForm() {
    const { addPost } = useContext(PostContext);
    const [selectedMood, setSelectedMood] = useState(null);
    const [errors, setErrors] = useState([]);
    const history = useHistory();

    //for the mental health resources modal
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const content = useRef();

    const submitForm = e => {
        e.preventDefault();
        setErrors([]); //clear out any old errors

        if (selectedMood === null) {
            const error = "You must select a mood icon to represent how you are feeling!";
            setErrors(errors => [...errors, error]);
        } else {
            const post = {
                moodId: selectedMood.id,
                content: (content.current.value === "" ? null : content.current.value)
            };

            addPost(post)
                .then(resp => {
                    //check for a flagged entry
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
            <div className="container mt-4">
                <Form onSubmit={e => submitForm(e)}>
                    <FormGroup>
                        <h2>I'm feeling{selectedMood ? <img src={"emoji/" + selectedMood.image + ".svg"} alt={selectedMood.name} className="selectedMood" /> : "..."}</h2>
                        <MoodSelector selectedMood={selectedMood} setSelectedMood={setSelectedMood} />
                    </FormGroup>
                    <FormGroup>
                        <h2>What's going on? <span className="font-italic text-muted">Optional</span></h2>
                        <Input type="textarea" name="content" id="content" style={{ height: "400px" }} innerRef={content} placeholder="Write as much or as little as you want!" />
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