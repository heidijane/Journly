import React from "react";
import moment from "moment";
import "./JournalPageEntry.css"

export default function JournalPageEntry({ post }) {

    return (
        <div className="JournalPage">
            <div className="d-flex flex-nowrap justify-content-start align-items-center">
                <img src={"/emoji/" + post.mood.image + ".svg"} alt={post.mood.name} className="JournalPage__Mood mr-2" />
                <h4>{moment(post.createDate).format('h:mm a')}</h4>
            </div>
            {
                post.content &&
                <div className="content">{post.content}</div>
            }
            {
                post.viewTime &&
                <div className="d-flex justify-content-start align-items-center py-0 flex-nowrap">
                    <img src={"/emoji/2714.svg"} alt="entry has been read" className="checkmark" />
                    <div>
                        <div className="text-muted font-italic overflow-hidden" style={{ fontSize: "small" }}>
                            Viewed by {post.therapist.nickName} on {moment(post.viewDate).format('MMMM Do YYYY [at] h:mm a')}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}