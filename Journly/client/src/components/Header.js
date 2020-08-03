import React, { useState, useContext, useEffect } from 'react';
import { NavLink as RRNavLink, Link } from "react-router-dom";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownItem,
    DropdownMenu,
    Button,
    Badge,
    Spinner
} from 'reactstrap';
import { UserContext } from "../providers/UserProvider";
import { PostContext } from '../providers/PostProvider';

export default function Header() {
    const { isLoggedIn, logout } = useContext(UserContext);
    const [collapsed, setCollapsed] = useState(true);
    const toggleNavbar = () => setCollapsed(!collapsed);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);

    const [unreadLoading, setUnreadLoading] = useState(true);
    const { getUnreadCount } = useContext(PostContext);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (currentUser.userTypeId === 1) {
            getUnreadCount()
                .then(setUnreadCount)
                .then(setUnreadLoading(false));
        }
    }, []);

    return (
        <div>
            <Navbar color="success" dark expand="md">
                <NavbarBrand tag={RRNavLink} to="/">Journly</NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} />
                <Collapse isOpen={!collapsed} navbar>
                    <Nav className="mr-auto" navbar>
                        {isLoggedIn &&
                            <>
                                <NavItem>
                                    <Dropdown isOpen={dropdownOpen} toggle={toggle} size="sm">
                                        <DropdownToggle caret className="btn btn-success">
                                            {
                                                currentUser.avatar
                                                    ?
                                                    <img src={currentUser.avatar} alt="my avatar" className="avatar avatar-small mr-1" />
                                                    :
                                                    <img className="avatar avatar-small mr-1" alt="my avatar"></img>
                                            }

                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem header>Account Settings</DropdownItem>
                                            <DropdownItem>Change Avatar</DropdownItem>
                                            <DropdownItem>Permissions</DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem onClick={logout}>Logout</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={RRNavLink} to="/">Home</NavLink>
                                </NavItem>
                                {
                                    currentUser.userTypeId === 0
                                        ?
                                        <>
                                            <NavItem>
                                                <NavLink tag={RRNavLink} to="/myentries">My Journal</NavLink>
                                            </NavItem>
                                            <NavItem className="d-flex align-items-center ml-1">
                                                <Link to="/newentry">
                                                    <Button color="info" size="sm">New Entry</Button>
                                                </Link>
                                            </NavItem>
                                        </>
                                        :
                                        <>
                                            <NavItem>
                                                <NavLink tag={RRNavLink} to="/">My Clients</NavLink>
                                            </NavItem>
                                            <NavItem className="d-flex justify-content-start align-items-center">
                                                <NavLink tag={RRNavLink} to="/entries">
                                                    Journal Entries
                                                    </NavLink>
                                                <Link to="/entries?viewed=false">
                                                    <Badge color="info" className="ml-1 px-2 py-1">
                                                        {
                                                            unreadLoading
                                                                ?
                                                                <Spinner />
                                                                :
                                                                unreadCount
                                                        }
                                                    </Badge>
                                                </Link>
                                            </NavItem>
                                        </>
                                }
                            </>
                        }
                        {!isLoggedIn &&
                            <>
                                <NavItem>
                                    <NavLink tag={RRNavLink} to="/start">Login</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={RRNavLink} to="/registerclient">Register</NavLink>
                                </NavItem>
                            </>
                        }
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}
