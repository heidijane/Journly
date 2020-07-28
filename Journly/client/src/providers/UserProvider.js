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

    const login = (email, pw) => {
        return firebase.auth().signInWithEmailAndPassword(email, pw)
            .then((signInResponse) => getUserData(signInResponse.user.uid))
            .then((userData) => {
                sessionStorage.setItem("userData", JSON.stringify(userData));
                setIsLoggedIn(true);
            });
    };

    const logout = () => {
        return firebase.auth().signOut()
            .then(() => {
                sessionStorage.clear()
                setIsLoggedIn(false);
            });
    };

    const register = (userData, password, therapistId) => {
        return firebase.auth().createUserWithEmailAndPassword(userData.email, password)
            .then((createResponse) => saveUser({ ...userData, firebaseUserId: createResponse.user.uid }, therapistId))
            .then((savedUserProfile) => {
                sessionStorage.setItem("userData", JSON.stringify(savedUserProfile))
                setIsLoggedIn(true);
            });
    };

    const getToken = () => firebase.auth().currentUser.getIdToken();

    const getUserData = (firebaseUserId) => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/${firebaseUserId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => resp.json()));
    };

    const saveUser = (userData, therapistId) => {
        return getToken().then((token) =>
            fetch(apiUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            }).then(resp => resp.json()));
    };

    return (
        <UserContext.Provider value={{ isLoggedIn, login, logout, register, getToken }}>
            {isFirebaseReady
                ? props.children
                : <Spinner className="app-spinner dark" />}
        </UserContext.Provider>
    );
}