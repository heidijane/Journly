import React, { useContext, useRef, useState } from "react"
import { Form, FormGroup, Input, Button } from "reactstrap"
import { PostContext } from "../../providers/PostProvider"
import Errors from "../Errors";
import { useHistory, useLocation } from 'react-router-dom';

export default ({ post, toggle }) => {

    const { therapistUpdate } = useContext(PostContext);
    const [errors, setErrors] = useState([]);

    let location = useLocation();
    const history = useHistory();

    const comment = useRef();

    const saveComment = (e) => {
        e.preventDefault();
        setErrors([]); //clear out any old errors

        if (comment.current.value === "") {
            const error = "Please leave a comment!";
            setErrors(errors => [...errors, error]);
        } else {
            const newPost = {
                id: post.id,
                comment: comment.current.value
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
                <Input
                    type="textarea"
                    id="comment"
                    name="comment"
                    style={{ height: "250px" }}
                    defaultValue={post.comment}
                    innerRef={comment}
                    placeholder="Add a comment..."
                />
            </FormGroup>
            <Errors errors={errors} />
            <FormGroup className="text-right">
                <Button color="secondary" onClick={toggle}>Cancel</Button>
                <Button color="primary" className="ml-2">Save Comment</Button>
            </FormGroup>
        </Form>
    )
}