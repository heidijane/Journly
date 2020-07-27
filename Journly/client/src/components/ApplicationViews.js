import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";
import Login from "./Login";
import RegisterClient from "./RegisterClient";
import RegisterCounselor from "./RegisterCounselor";
import Dashboard from "./Dashboard";

export default function ApplicationViews() {
    const { isLoggedIn } = useContext(UserContext);

    return (
        <main>
            <Switch>
                <Route path="/" exact>
                    {isLoggedIn ? <Dashboard /> : <Redirect to="/login" />}
                </Route>

                <Route path="/login">
                    <Login />
                </Route>

                <Route path="/registerclient">
                    <RegisterClient />
                </Route>

                <Route path="/registercounselor">
                    <RegisterCounselor />
                </Route>

            </Switch>
        </main>
    );
};
