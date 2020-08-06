/*
    CommentForm.js
    This component renders a form that allows a therapist to comment on a client's post.
    This same component is used for both adding and editing a comment.
*/

import React, { useContext, useRef, useState } from "react"
import { Form, FormGroup, Input, Button } from "reactstrap"
import { PostContext } from "../../providers/PostProvider"
import Errors from "../Errors";
import { useHistory, useLocation } from 'react-router-dom';
import TextEditor from "./TextEditor"

export default ({ post, toggle }) => {

    const { therapistUpdate } = useContext(PostContext);
    const [errors, setErrors] = useState([]);

    let location = useLocation();
    const history = useHistory();

    const [comment, setComment] = useState(post.comment);

    //validates form fields and sends the comment to the server
    const saveComment = (e) => {
        e.preventDefault();
        setErrors([]); //clear out any old errors

        if (comment === "") {
            const error = "Please leave a comment!";
            setErrors(errors => [...errors, error]);
        } else {
            const newPost = {
                id: post.id,
                comment: comment
            }
            therapistUpdate(newPost)
                .then(toggle)
                .then(() => {
                    //refreshes the current route to reflect the deletion
                    history.push({ pathname: "/empty" });
                    history.replace({ pathname: location.pathname })
                });
        }

    }

    return (
        <Form onSubmit={e => saveComment(e)}>
            <FormGroup>
                <TextEditor content={comment} setContent={setComment} />
            </FormGroup>
            <Errors errors={errors} />
            <FormGroup className="text-right">
                <Button color="secondary" onClick={toggle}>Cancel</Button>
                <Button color="primary" className="ml-2">Save Comment</Button>
            </FormGroup>
        </Form>
    )
}