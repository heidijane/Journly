import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../providers/UserProvider";

export const PostContext = React.createContext();

export const PostProvider = (props) => {
    const { getToken } = useContext(UserContext)
    const [posts, setPosts] = useState([]);
    const [unreadPosts, setUnreadPosts] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);

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
                if (resp.status === 200) {
                    return resp.json();
                }
                return null;
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
                .then(setUnreadPosts));
    };

    const getUnreadCount = () => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/unreadcount`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(resp => resp.json())
                .then(setUnreadCount));
    }

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

    const therapistUpdate = (post) => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/comment`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(post)
            })
                .then(resp => {
                    if (resp.ok) {
                        return resp.json();
                    }
                    throw new Error("Unauthorized");
                })
        )
    };

    const flagPost = (id) => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/flag/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
                .then(resp => {
                    if (resp.ok) {
                        return resp.json();
                    }
                    throw new Error("Unauthorized");
                })
        )
    };

    const markAllRead = (id, date) => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/markallread?id=${id}&date=${date}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
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

    const searchPost = (clientId = null, viewed = null, flagged = null, orderDesc = true, limit = 0, start = 0, deleted = true) => {
        return getToken().then((token) => {
            let urlParams = "?";
            if (clientId !== null) {
                urlParams += `clientId=${clientId}`;
            }
            if (viewed !== null) {
                urlParams += `&viewed=${viewed}`;
            }
            if (flagged !== null) {
                urlParams += `&flagged=${flagged}`;
            }
            if (orderDesc !== null) {
                urlParams += `&orderDesc=${orderDesc}`;
            }
            if (limit !== 0) {
                urlParams += `&limit=${limit}`;
            }
            if (start !== 0) {
                urlParams += `&start=${start}`;
            }
            if (deleted !== true) {
                urlParams += `&deleted=${deleted}`;
            }
            fetch(`${apiUrl}/search${urlParams}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(resp => resp.json())
                .then(setPosts)
        });
    }

    //initial render for unread count
    useEffect(() => {
        if (currentUser !== null && currentUser.userTypeId === 1) {
            getUnreadCount()
        }
    }, []);

    //update the unread count when the posts component is changed
    useEffect(() => {
        if (currentUser !== null && currentUser.userTypeId === 1) {
            getUnreadCount()
        }
    }, [posts]);

    return (
        <PostContext.Provider value={{
            posts, getCurrentUserPosts, getCurrentUserPostsByDate, getCurrentUserPostById,
            addPost, editPost, deletePost, getLatestPost, getUnreadCountByUser, getUnreadPosts,
            getUserPostsByDate, searchPost, therapistUpdate, markAllRead, getUnreadCount, unreadPosts, flagPost, unreadCount
        }}>
            {props.children}
        </PostContext.Provider>
    );
};