/*
    EditEntryForm.js
    Renders a form that allows a client to edit their journal entry. It pulls the post data in from the id URL parameter.
    Otherwise it is the same as the AddEntryForm component.
*/

import React, { useState, useRef, useContext, useEffect } from "react";
import { Form, FormGroup, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Alert } from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import MoodSelector from "./MoodSelector";
import "./AddEntryForm.css"
import Errors from "../Errors";
import { PostContext } from "../../providers/PostProvider";
import HealthResources from "../HealthResources";
import TextEditor from "./TextEditor"

export default function EditEntryForm() {
    const { editPost, getCurrentUserPostById } = useContext(PostContext);
    const [post, setPost] = useState(null);
    const [selectedMood, setSelectedMood] = useState(null);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    const { id } = useParams();

    useEffect(() => {
        getCurrentUserPostById(id)
            .then(setPost)
            .then(setLoading(false));
    }, []);

    useEffect(() => {
        if (post) {
            setSelectedMood(post.mood)
            setContent(post.content)
        }
    }, [post])

    //for the mental health resources modal
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [content, setContent] = useState("");

    //validate form fields and submit the edit
    const submitForm = e => {
        e.preventDefault();
        setErrors([]); //clear out any old errors

        if (selectedMood === null) {
            const error = "You must select a mood icon to represent how you are feeling!";
            setErrors(errors => [...errors, error]);
        } else {
            const editedPost = {
                id: post.id,
                moodId: selectedMood.id,
                content: (content === "" ? null : content)
            };

            editPost(editedPost)
                .then(resp => {
                    //check for a flagged entry
                    if (resp.flagged === true) {
                        toggle();
                    } else {
                        history.push(`/myjournal/${resp.createDate}`)
                    }
                })
        }

    }

    if (loading) {
        return <Spinner />
    } else if (post == null) {
        return <Alert color="red">This post does not exist!</Alert>
    } else {
        return (
            <>
                <div className="container container-body p-4">
                    <Form onSubmit={e => submitForm(e)}>
                        <FormGroup>
                            <h2>I'm feeling{selectedMood ? <img src={"/emoji/" + selectedMood.image + ".svg"} alt={selectedMood.name} className="selectedMood" /> : "..."}</h2>
                            <MoodSelector selectedMood={post.mood} setSelectedMood={setSelectedMood} />
                        </FormGroup>
                        <FormGroup>
                            <h2>What's going on? <span className="font-italic text-muted">Optional</span></h2>
                            <TextEditor content={content} setContent={setContent} />
                        </FormGroup>
                        <Errors errors={errors} />
                        <FormGroup className="text-right">
                            <Button type="submit" color="primary">Edit Journal Entry</Button>
                        </FormGroup>
                    </Form>
                </div>
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Remember we are here for you!</ModalHeader>
                    <ModalBody>
                        <HealthResources />
                    </ModalBody>
                    <ModalFooter className="text-right">
                        <Button color="primary" onClick={() => history.push(`/myjournal/${post.createDate}`)}>Continue</Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}