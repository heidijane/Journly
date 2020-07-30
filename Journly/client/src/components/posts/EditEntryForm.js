import React, { useState, useRef, useContext, useEffect } from "react";
import { Form, FormGroup, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Alert } from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import MoodSelector from "./MoodSelector";
import "./AddEntryForm.css"
import Errors from "../Errors";
import { PostContext } from "../../providers/PostProvider";

export default function EditEntryForm() {
    const { getCurrentUserPostById } = useContext(PostContext);
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
        }
    }, [post])

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

            // addPost(post)
            //     .then(resp => {
            //         //check for a flagged entry
            //         if (resp.flagged === true) {
            //             toggle();
            //         } else {
            //             history.push("/myentries")
            //         }
            //     })
        }

    }

    if (loading) {
        return <Spinner />
    } else if (post == null) {
        return <Alert color="red">This post does not exist!</Alert>
    } else {
        return (
            <>
                <div className="container mt-4">
                    <Form onSubmit={e => submitForm(e)}>
                        <FormGroup>
                            <h2>I'm feeling{selectedMood ? <img src={"/emoji/" + selectedMood.image + ".svg"} alt={selectedMood.name} className="selectedMood" /> : "..."}</h2>
                            <MoodSelector selectedMood={post.mood} setSelectedMood={setSelectedMood} />
                        </FormGroup>
                        <FormGroup>
                            <h2>What's going on? <span className="font-italic text-muted">Optional</span></h2>
                            <Input
                                type="textarea"
                                name="content"
                                id="content"
                                style={{ height: "400px" }}
                                innerRef={content}
                                placeholder="Write as much or as little as you want!"
                                defaultValue={post.content}
                            />
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
                        List of mental health resources.
        </ModalBody>
                    <ModalFooter className="text-right">
                        <Button color="primary" onClick={() => history.push("/myentries")}>Continue</Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}