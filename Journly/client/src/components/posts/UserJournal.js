/*
    UserJournal.js
    To be used by a therapist, gets a list of a client's posts by date and then renders them using the JournalPage component.
*/

import React, { useContext, useState, useEffect } from "react";
import { PostContext } from "../../providers/PostProvider";
import { Spinner } from "reactstrap";
import { useParams } from "react-router-dom";
import JournalPage from "./JournalPage";

export default function UserJournal() {
    const { posts, getUserPostsByDate } = useContext(PostContext);
    const [loading, setLoading] = useState(true);

    const { id, date } = useParams();

    useEffect(() => {
        getUserPostsByDate(id, date).then(setLoading(false));
    }, []);

    if (loading) {
        return (
            <Spinner />
        );
    } else {
        return (
            <JournalPage posts={posts} />
        );
    }

}