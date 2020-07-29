import React, { useState, useContext } from "react";
import { UserContext } from "../providers/UserProvider";

export const PostContext = React.createContext();

export const PostProvider = (props) => {
    const { getToken } = useContext(UserContext)
    const [posts, setPosts] = useState([]);

    const apiUrl = '/api/post'

    const getCurrentUserPosts = () => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/current`, {
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