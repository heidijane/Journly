import React from "react";
import { Card, CardBody, ModalFooter, ModalHeader } from "reactstrap";
import moment from "moment";
import "./Post.css";
import { truncate } from "../../utilities/truncate";

export default function Post({ post }) {

    return (
        <Card color="light">
            {
                post.content &&
                <div className="moodWrapper"><img src={"/emoji/" + post.mood.image + ".svg"} alt={post.mood.name} className="mood" /></div>
            }
            <ModalHeader className="d-flex justify-content-center">
                <span className="mb-0">{moment(post.createDate).format('MMMM Do YYYY, h:mm a')}</span>
            </ModalHeader>
            <CardBody>
                {
                    post.content
                        ?
                        <div className="content">{truncate(post.content, 400)}</div>
                        :
                        <img src={"/emoji/" + post.mood.image + ".svg"} alt={post.mood.name} className="mood-large" />
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
    )
}