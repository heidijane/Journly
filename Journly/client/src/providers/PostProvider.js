/*
    PostProvider.js
    Interacts with the post API.

    Establishes state for posts, unreadPosts, and unreadCount
    Tracks state for unreadCount so that it renders initially and then when the posts state is changed

    Methods included:

    Client Methods
    ---------------------------
    * getCurrentUserPosts - gets a list of posts by the current user
    * getCurrentUserPostsByDate - gets a list of posts by the current user matching a certain date
    * getCurrentUserPostsById - gets a single post by the current user
    * addPost - create a new post
    * editPost - edit a post
    * deletePost - soft-delete a post
         
    Therapist Methods
    ---------------------------
    * getUnreadPosts - get all unread posts for current therapist user
    * getUnreadCount - get number of unread posts for current therapist user
    * getUnreadCountByUser - get number of unread posts for a particular client
    * getLatestPost - get the latest post for a client
    * getUserPostsByDate - get all posts matching a certain date
    * therapistUpdate - updates a posts viewTime and comment if provided
    * markAllRead - marks all posts on a particular date as read
    * flagPost - toggles the flagged status of a post
    * searchPost - used for filtering a therapists posts
*/

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

    /***** 
     * 
    Client Methods
        to be used by client type users
       *
    *****/

    //gets a list of posts by the current user
    //* limit - max number of posts that you want to be returned, if left at 0 there will be no limit
    //* start - number of posts you want to skip, may be used for pagination in the future
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

    //gets a list of posts by the current user matching a certain date
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

    //gets a single post by the current user
    //used in the EditEntryForm component
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

    //create a new post
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

    //edit a post
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

    //soft-delete a post
    //the post will dissapear for the client but their therapist will be able to see that something was deleted
    //the content of the post is not actually deleted, the "deleted" flag is just turned on
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

    /***** 
     * 
    Therapist Methods
        to be used by therapist type users
       *
    *****/

    //get all of a therapists unread entries
    //* limit - max number of posts that you want to be returned, if left at 0 there will be no limit
    //* start - number of posts you want to skip, may be used for pagination in the future
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

    //get number of unread posts for current therapist
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

    //get number of unread posts for a particular client
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

    //get the latest post for a client, returns a single post object
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

    //get all posts matching a certain date
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

    //updates a posts viewTime and comment
    //if comment is left blank it can be used to mark a single post as read
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

    //marks all posts on a particular date as read
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

    //toggles the flagged status of a post
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

    /*
        used for filtering a therapist's clients' journal entries
        
        Parameters
        * clientId - Id of the client whose posts you want to see, if left null it will return posts by all of a therapist's clients
        * viewed - if true will return read posts, if false will return unread posts, if null will return both unread and read
        * flagged - if true will return flagged posts, if false will return unflagged posts, if null will return both
        * orderDesc - if true will return posts newest to oldest, if false will return posts oldest to newest
        * limit - max number of posts that you want to be returned, if left at 0 there will be no limit
        * start - number of posts you want to skip, may be used for pagination in the future
        * deleted - if true it will show both deleted and undeleted posts, if false it will filter out deleted posts
    */
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

    /*
        Set the state of unreadCount that is used in the Header component for therapists
    */

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
            posts,
            unreadPosts,
            unreadCount,
            getCurrentUserPosts,
            getCurrentUserPostsByDate,
            getCurrentUserPostById,
            addPost,
            editPost,
            deletePost,
            getUnreadPosts,
            getUnreadCount,
            getUnreadCountByUser,
            getLatestPost,
            getUserPostsByDate,
            therapistUpdate,
            markAllRead,
            flagPost,
            searchPost,
        }}>
            {props.children}
        </PostContext.Provider>
    );
};