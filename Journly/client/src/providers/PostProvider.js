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

    const getCurrentUserPostsByDate = (date) => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/current/${date}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => resp.json())
                .then(setPosts));
    };

    const addPost = (post) => {
        return getToken().then((token) =>
            fetch(apiUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(post)
            })
                .then(resp => {
                    getCurrentUserPosts(0)
                    return resp.json();
                })
        );
    };

    return (
        <PostContext.Provider value={{
            posts, getCurrentUserPosts, getCurrentUserPostsByDate, addPost
        }}>
            {props.children}
        </PostContext.Provider>
    );
};