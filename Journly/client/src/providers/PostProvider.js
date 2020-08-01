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

    const getCurrentUserPostById = (id) => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((resp) => {
                if (resp.ok) {
                    return resp.json();
                }
                throw new Error("Unauthorized");
            })

        )
    };

    const getUserPostsByDate = (id, date) => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/user/${id}?date=${date}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => resp.json())
                .then(setPosts));
    };

    const getLatestPost = (id) => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/latest/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((resp) => {
                if (resp.ok) {
                    return resp.json();
                }
                throw new Error("Unauthorized");
            })

        )
    }

    const getUnreadPosts = (limit = 6, start = 0) => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/unread?limit=${limit}&start=${start}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => resp.json())
                .then(setPosts));
    };

    const getUnreadCountByUser = (id) => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/unreadcount/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((resp) => {
                if (resp.ok) {
                    return resp.json();
                }
                throw new Error("Unauthorized");
            })

        )
    }

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
        )
    };

    const editPost = (post) => {
        return getToken().then((token) =>
            fetch(apiUrl, {
                method: "PUT",
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
        )
    };

    const deletePost = (id) => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }));
    };

    const searchPost = (therapistId = null, clientId = null, viewed = null, flagged = null, orderDesc = true) => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/search?therapistId=${therapistId}&clientId=${clientId}&viewed=${viewed}&flagged=${flagged}&orderDesc=${orderDesc}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((resp) => {
                if (resp.ok) {
                    return resp.json();
                }
                throw new Error("Unauthorized");
            })

        )
    }

    return (
        <PostContext.Provider value={{
            posts, getCurrentUserPosts, getCurrentUserPostsByDate, getCurrentUserPostById,
            addPost, editPost, deletePost, getLatestPost, getUnreadCountByUser, getUnreadPosts,
            getUserPostsByDate
        }}>
            {props.children}
        </PostContext.Provider>
    );
};