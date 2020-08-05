/*
    UserProvider.js
    Interacts with the user API.

    Establishes an isLoggedIn state used for checking a user's loggedin status

    Methods included:
    * login - checks a users login credentials against firebase, gets their user data, adn then sets a session to log them in
    * logout - destroys the firebase local storage variable and the user data session, which logs the user out
    * register - creates a firebase record for the new user, calls the saveUser method to store their data in the db and then logs them in
    * saveUser - stores user data in the db
    * updateUser - updates user data in the db
    * getToken - gets a firebase token for verifying authentication
    * getUserData - gets a users data using their firebase UID
*/

import React, { useState, useEffect, createContext } from "react";
import { Spinner } from "reactstrap";
import * as firebase from "firebase/app";
import "firebase/auth";

export const UserContext = createContext();

export function UserProvider(props) {
    const apiUrl = "/api/user";

    const userData = sessionStorage.getItem("userData");
    const [isLoggedIn, setIsLoggedIn] = useState(userData != null);

    const [isFirebaseReady, setIsFirebaseReady] = useState(false);
    useEffect(() => {
        firebase.auth().onAuthStateChanged((u) => {
            setIsFirebaseReady(true);
        });
    }, []);

    //checks a users login credentials against firebase, gets their user data, adn then sets a session to log them in
    const login = (email, pw) => {
        return firebase.auth().signInWithEmailAndPassword(email, pw)
            .then((signInResponse) => getUserData(signInResponse.user.uid))
            .then((userData) => {
                sessionStorage.setItem("userData", JSON.stringify(userData));
                setIsLoggedIn(true);
            });
    };

    //destroys the firebase local storage variable and the user data session, which logs the user out
    const logout = () => {
        return firebase.auth().signOut()
            .then(() => {
                sessionStorage.clear()
                setIsLoggedIn(false);
            });
    };

    //creates a firebase record for the new user, calls the saveUser method to store their data in the db and then logs them in
    const register = (userProfile, password) => {
        return firebase.auth().createUserWithEmailAndPassword(userProfile.email, password)
            .then((createResponse) => saveUser({ ...userProfile, firebaseUserId: createResponse.user.uid }))
            .then((savedUserProfile) => {
                sessionStorage.setItem("userData", JSON.stringify(savedUserProfile))
                setIsLoggedIn(true);
            });
    };

    //stores user data in the db
    const saveUser = (userProfile) => {
        return getToken().then((token) =>
            fetch(apiUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userProfile)
            }).then(resp => resp.json()));
    };

    //updates user data in the db
    const updateUser = (user) => {
        return getToken().then((token) =>
            fetch(apiUrl, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            }).then((resp) => {
                if (resp.ok) {
                    //update session date with new user info
                    return resp.json();
                }
                throw new Error("Unauthorized");
            })
                .then(resp => {
                    //in order to get the avatar data you have to get the user data again...
                    //I originally tried just using the data sent back by the response but Avatar always came back as null
                    //I'll look into this more later. Tried to fix on the server-side and couldn't figure it out.
                    //The Include of the Avatar object only works some of the time but I can't figure out what is different between the two requests.
                    //I'm sure future me will easily be able to solve this.
                    const jsonResp = JSON.stringify(resp);
                    getUserData(resp.firebaseUserId)
                        .then((userData) => {
                            sessionStorage.clear();
                            sessionStorage.setItem("userData", JSON.stringify(userData));
                            setIsLoggedIn(true);
                        })
                    return resp;
                })
        )
    };

    //gets a firebase token for verifying authentication
    const getToken = () => firebase.auth().currentUser.getIdToken();

    //gets a users data using their firebase UID
    const getUserData = (firebaseUserId) => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/${firebaseUserId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => resp.json()));
    };

    return (
        <UserContext.Provider value={{ isLoggedIn, login, logout, register, updateUser, getToken, getUserData }}>
            {isFirebaseReady
                ? props.children
                : <Spinner className="app-spinner dark" />}
        </UserContext.Provider>
    );
}