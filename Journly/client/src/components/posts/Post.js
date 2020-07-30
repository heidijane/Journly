import React from "react";
import { Link } from 'react-router-dom'
import { Card, CardBody, ModalFooter, ModalHeader } from "reactstrap";
import moment from "moment";
import "./Post.css";
import { truncate } from "../../utilities/truncate";

export default function Post({ post }) {

    return (
        <Link to={"/myjournal/" + post.createDate} className="text-decoration-none text-reset">
            <Card color="light">
                {
                    post.content &&
                    <div className="moodWrapper"><img src={"/emoji/" + (!post.deleted ? post.mood.image : "26AA") + ".svg"} alt={post.mood.name} className="mood" /></div>
                }
                <ModalHeader className="d-flex justify-content-center">
                    <span className="mb-0">{moment(post.createDate).format('MMMM Do YYYY, h:mm a')}</span>
                </ModalHeader>
                <CardBody>
                    {
                        post.content
                            ?
                            <div className="content">
                                {!post.deleted ? truncate(post.content, 400) : <span className="font-italic text-muted">This entry has been deleted.</span>}
                            </div>
                            :
                            <img src={"/emoji/" + (!post.deleted ? post.mood.image : "26AA") + ".svg"} alt={post.mood.name} className="mood-large" />
                    }
                </CardBody>
                {
                    post.viewTime &&
                    <ModalFooter className="d-flex justify-content-start align-items-center py-0 flex-nowrap">
                        <img src={"/emoji/2714.svg"} alt="entry has been read" className="checkmark" />
                        <div>
                            <div className="text-muted font-italic overflow-hidden" style={{ fontSize: "small" }}>
                                Viewed by {post.therapist.nickName} on {moment(post.viewDate).format('MMMM Do YYYY [at] h:mm a')}
                            </div>
                        </div>
                    </ModalFooter>
                }
            </Card>
        </Link>
    )
}