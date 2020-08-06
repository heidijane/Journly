/*
    FilterEntries.js
    This component renders a list of journal entries that match various criteria contained in the URL.
    It can currently sort based on 
    * clientId (stored as "user" in the URL)
    * viewed
    * flagged
    * orderDesc
*/

import React, { useContext, useEffect, useState } from "react"
import { useLocation } from 'react-router-dom'
import { PostContext } from "../../providers/PostProvider";
import { ClientContext } from "../../providers/ClientProvider";
import PostList from "./PostList";
import { Spinner, Row, Col, FormGroup, Input, Alert } from "reactstrap";

export default function FilterEntries() {

    const { posts, searchPost } = useContext(PostContext);
    const { clients, getClients } = useContext(ClientContext);
    const [loading, setLoading] = useState(true);
    const [loadingClients, setLoadingClients] = useState(true);

    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const [clientId, setClientId] = useState(params.get("user"));
    const [viewed, setViewed] = useState(params.get("viewed"));
    const [flagged, setFlagged] = useState(params.get("flagged"));
    const [orderDesc, setOrderDesc] = useState(params.get("orderDesc"));

    useEffect(() => {
        getClients().then(setLoadingClients(false));
    }, []);

    useEffect(() => {
        searchPost(clientId, viewed, flagged, orderDesc).then(setLoading(false));
    }, [clientId, viewed, flagged, orderDesc]);

    const RenderFilterForm = () => {
        return (
            <Row form className="bg-light rounded border pt-3 px-2">
                <Col>
                    <FormGroup>
                        <Input
                            type="select"
                            name="client"
                            id="client"
                            value={clientId}
                            onChange={e => { setLoading(true); setClientId(e.target.value) }}>
                            <option value="">All Clients</option>
                            {
                                clients.map(client => {
                                    return <option key={"client-" + client.user.id} value={client.user.id}>{client.user.nickName}</option>
                                })
                            }
                        </Input>
                    </FormGroup>
                </Col>
                <Col md={2}>
                    <FormGroup>
                        <Input
                            type="select"
                            name="viewed"
                            id="viewed"
                            defaultValue={viewed}
                            onChange={e => { setLoading(true); setViewed(e.target.value) }}>
                            <option value="">All Entries</option>
                            <option value="false">Unread</option>
                            <option value="true">Read</option>
                        </Input>
                    </FormGroup>
                </Col>
                <Col md={2}>
                    <FormGroup>
                        <Input
                            type="select"
                            name="flagged"
                            id="flagged"
                            defaultValue={flagged}
                            onChange={e => { setLoading(true); setFlagged(e.target.value) }}>
                            <option value="">Both Flagged/Unflagged</option>
                            <option value="true">Flagged</option>
                            <option value="false">Unflagged</option>
                        </Input>
                    </FormGroup>
                </Col>
                <Col md={3}>
                    <FormGroup>
                        <Input
                            type="select"
                            name="orderDesc"
                            id="orderDesc"
                            defaultValue={orderDesc}
                            onChange={e => { setLoading(true); setOrderDesc(e.target.value) }}>
                            <option value="true">Newest to Oldest</option>
                            <option value="false">Oldest to Newest</option>
                        </Input>
                    </FormGroup>
                </Col>
            </Row>
        );
    }

    if (loading || loadingClients) {
        return <Spinner />
    } else {
        if (posts.length > 0) {
            return (
                <div className="container py-4">
                    <h3>Journal Entries</h3>
                    <hr />
                    {RenderFilterForm()}
                    <PostList posts={posts} />
                </div>
            );
        } else {
            return (
                <div className="container py-4">
                    <h3>Journal Entries</h3>
                    <hr />
                    {RenderFilterForm()}
                    <Alert color="info" className="py-4">There are no entries matching your search criteria.</Alert>
                </div>
            );
        }

    }

}