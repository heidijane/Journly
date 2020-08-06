/*
    JournalPageEntry.js
    This page contains renders one journal page entry and should be used with the JournalPage component.
    This component can be used to render entries for either clients or therapists.
    Clients will be able to see edit and delete buttons for their entries.
    Therapists will see buttons allowing them to mark an entry as read, leave a comment, or edit/delete a comment.
    Therapists will also see a button that allows them to flag or unflag an entry.
*/

import React, { useState, useContext } from "react";
import moment from "moment";
import "./JournalPageEntry.css"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { PostContext } from "../../providers/PostProvider";
import { useHistory, useLocation } from 'react-router-dom'
import CommentForm from "./CommentForm";

export default function JournalPageEntry({ post }) {

    const { deletePost, therapistUpdate, flagPost } = useContext(PostContext);

    let location = useLocation();
    const history = useHistory();

    //modal states for the delete modal
    const [deleteModal, setDeleteModal] = useState(false)
    const deleteModalToggle = () => setDeleteModal(!deleteModal)

    //modal states for the comment modal
    const [commentModal, setCommentModal] = useState(false)
    const commentModalToggle = () => setCommentModal(!commentModal)

    //to be used by a client, sends a request to soft-delete a post to the server
    const deleteEntry = () => {
        deletePost(post.id)
            .then(deleteModalToggle)
            .then(() => {
                //refreshes the current route to reflect the deletion
                history.push({ pathname: "/empty" });
                history.replace({ pathname: location.pathname });
            });
    }

    //to be used by a therapist, sends a request to mark a post as read without a comment
    const markRead = () => {
        const newPost = {
            id: post.id,
            comment: ""
        }
        therapistUpdate(newPost)
            .then(() => {
                //refreshes the current route to reflect the deletion
                history.push({ pathname: "/empty" });
                history.replace({ pathname: location.pathname });
            });

    }

    //to be used by a therapist, sends a request to toggle an entry's flagged status
    const toggleFlag = () => {
        flagPost(post.id)
            .then(() => {
                //refreshes the current route to reflect the deletion
                history.push({ pathname: "/empty" });
                history.replace({ pathname: location.pathname });
            });
    }

    const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);

    if (post.deleted) {
        post.content = <span className="font-italic text-muted">This entry has been deleted.</span>
    }

    return (
        <>
            <div className={"JournalPage" + (post.flagged && currentUser.userTypeId === 1 ? " flagged" : "")}>
                <a id={post.id}></a>
                <div className="d-flex flex-nowrap justify-content-start align-items-center">
                    <img src={"/emoji/" + (!post.deleted ? post.mood.image : "26AA") + ".svg"} alt={post.mood.name} className="JournalPage__Mood mr-1" />
                    <h4>{moment(post.createDate).format('h:mm a')}</h4>
                    {
                        !post.deleted && currentUser.userTypeId === 0 ?
                            <>
                                <Button color="light" size="sm" className="ml-1 p-0"><img src={"/emoji/270F.svg"} alt="edit post" onClick={() => history.push(`/editentry/${post.id}`)} /></Button>
                                <Button color="light" size="sm" className="ml-1 p-0"><img src={"/emoji/E262.svg"} alt="delete post" onClick={deleteModalToggle} /></Button>
                            </>
                            :
                            <Button color={post.flagged === false ? "light" : "danger"} size="sm" className="ml-1" onClick={toggleFlag}>{post.flagged === false ? "Flag" : "Unflag"}</Button>
                    }
                </div>
                {
                    post.content &&
                    <div className="content" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                }
                {
                    post.editTime !== null &&
                    <div className="mt-3">
                        <span className="font-italic text-muted">This entry was edited on {moment(post.editTime).format('MMMM Do YYYY [at] h:mm a')}.</span>
                    </div>
                }
                {
                    post.viewTime &&
                    <div className="TherapistComment rounded p-2 mt-2">
                        <div className="d-flex justify-content-start align-items-center py-0 flex-nowrap">
                            <img src={"/emoji/" + (post.comment ? "E263" : "2714") + ".svg"} alt="entry has been read" className="checkmark mr-1" />
                            <div>
                                <div className="text-muted font-italic overflow-hidden">
                                    {
                                        currentUser.id !== post.userId
                                            ?
                                            <span>You viewed</span>
                                            :
                                            <span>Viewed by {post.therapist.nickName}</span>
                                    } on {moment(post.viewDate).format('MMMM Do YYYY [at] h:mm a')}
                                </div>
                            </div>
                            {
                                currentUser.userTypeId == 1 && !post.deleted &&
                                <>
                                    <Button color="light" size="sm" className="ml-1 p-0"><img src={"/emoji/" + (post.comment === "" ? "E263" : "270F") + ".svg"} alt="edit comment" onClick={commentModalToggle} /></Button>
                                    {
                                        post.comment &&
                                        <Button color="light" size="sm" className="ml-1 p-0"><img src={"/emoji/E262.svg"} alt="delete comment" onClick={markRead} /></Button>
                                    }
                                </>
                            }
                        </div>
                        {
                            post.comment &&
                            <div>{post.comment}</div>
                        }
                    </div>
                }
                {
                    !post.viewTime && !post.deleted && currentUser.userTypeId == 1 &&
                    <div className="mt-4">
                        <Button color="primary" onClick={commentModalToggle}>Comment</Button>
                        <Button color="success" className="ml-2" onClick={markRead}>Mark as Read</Button>
                    </div>
                }
            </div>
            {
                currentUser.userTypeId == 0 &&
                <Modal isOpen={deleteModal} toggle={deleteModalToggle}>
                    <ModalHeader toggle={deleteModalToggle}>
                        Delete Journal Entry
                    </ModalHeader>
                    <ModalBody>
                        <span className="lead">
                            Are you sure you want to delete this journal entry?
                    </span>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            type="button"
                            color="secondary"
                            onClick={deleteModalToggle}
                        >Cancel</Button>
                        <Button
                            type="submit"
                            color="danger"
                            className="ml-2"
                            onClick={deleteEntry}
                        >Delete Entry</Button>
                    </ModalFooter>
                </Modal>
            }
            {
                currentUser.userTypeId == 1 &&
                <Modal isOpen={commentModal} toggle={commentModalToggle}>
                    <ModalHeader toggle={commentModalToggle}>
                        Leave a Comment
                    </ModalHeader>
                    <ModalBody>
                        <CommentForm post={post} toggle={commentModalToggle} />
                    </ModalBody>
                </Modal>
            }
        </>
    )
}