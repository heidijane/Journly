import React, { useState, useContext } from "react";
import { UserContext } from "../providers/UserProvider";

export const PostContext = React.createContext();

export const PostProvider = (props) => {
    const { getToken } = useContext(UserContext)
    const [posts, setPosts] = useState([]);

    const apiUrl = '/api/post'

    const getCurrentUserPosts = (limit = 6, start = 0) => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/current?limit=${limit}&start=${start}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => resp.json())
                .then(setPosts));
    };

    return (
        <PostContext.Provider value={{
            posts, getCurrentUserPosts
        }}>
            {props.children}
        </PostContext.Provider>
    );
};