import React, { useContext, useEffect, useState } from "react"
import { useLocation } from 'react-router-dom'
import { PostContext } from "../../providers/PostProvider";
import PostList from "./PostList";
import { Spinner } from "reactstrap";

export default function FilterEntries() {

    const { posts, searchPost } = useContext(PostContext);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const clientId = params.get("user");
    const viewed = params.get("viewed");
    const flagged = params.get("flagged");
    const orderDesc = params.get("orderDesc");

    console.log("clientId: ", clientId);
    console.log("viewed: ", viewed);
    console.log("flagged: ", flagged);
    console.log("orderDesc: ", orderDesc);

    useEffect(() => {
        searchPost(clientId, viewed, flagged, orderDesc).then(setLoading(false));
    }, []);

    if (loading) {
        return <Spinner />
    } else {
        return (
            <div className="container mt-4">
                <PostList posts={posts} />
            </div>
        );
    }

}