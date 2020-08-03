/*
    MyJournal.js
    For a client, gets the posts for the date in the URL parameter then renders it.
*/

import React, { useContext, useState, useEffect } from "react";
import { PostContext } from "../../providers/PostProvider";
import { Spinner } from "reactstrap";
import { useParams } from "react-router-dom";
import JournalPage from "./JournalPage";

export default function MyJournal() {
    const { posts, getCurrentUserPostsByDate } = useContext(PostContext);
    const [loading, setLoading] = useState(true);

    const { date } = useParams();

    useEffect(() => {
        getCurrentUserPostsByDate(date).then(setLoading(false));
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