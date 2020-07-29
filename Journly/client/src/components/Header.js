import React, { useState, useContext } from 'react';
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
    Button
} from 'reactstrap';
import { UserContext } from "../providers/UserProvider";

export default function Header() {
    const { isLoggedIn, logout } = useContext(UserContext);
    const [collapsed, setCollapsed] = useState(true);
    const toggleNavbar = () => setCollapsed(!collapsed);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);


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
                                <NavItem>
                                    <NavLink tag={RRNavLink} to="/myentries">My Journal</NavLink>
                                </NavItem>
                                <NavItem className="d-flex align-items-center ml-1">
                                    <Link to="/newentry">
                                        <Button color="info" size="sm">New Entry</Button>
                                    </Link>
                                </NavItem>
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
