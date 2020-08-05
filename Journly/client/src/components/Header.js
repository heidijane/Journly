/*
    Header.js
    Renders the navigation bar to be used at the top of every page.
    Works for both therapists and clients.
*/

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
    Button,
    Badge,
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';
import { UserContext } from "../providers/UserProvider";
import { PostContext } from '../providers/PostProvider';
import UpdateUserForm from './users/UpdateUserForm';
import Avatar from './users/Avatar';
import ChangeAvatar from './users/ChangeAvatar';
import { AvatarContext, AvatarProvider } from '../providers/AvatarProvider';

export default function Header() {
    const { isLoggedIn, logout } = useContext(UserContext);
    const [collapsed, setCollapsed] = useState(true);
    const toggleNavbar = () => setCollapsed(!collapsed);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);

    const { unreadCount } = useContext(PostContext);

    //modal states for the update user profile modal
    const [updateUserModal, setUpdateUserModal] = useState(false);
    const updateUserModalToggle = () => setUpdateUserModal(!updateUserModal);

    //modal states for the change avatar modal
    const [avatarModal, setAvatarModal] = useState(false);
    const avatarModalToggle = () => setAvatarModal(!avatarModal);

    return (
        <>
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
                                            <DropdownToggle caret className="btn btn-success d-flex align-items-center">
                                                <Avatar avatar={currentUser.avatar} color={currentUser.favColor} name={currentUser.nickName} size="small" />
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem header>Account Settings</DropdownItem>
                                                <DropdownItem onClick={updateUserModalToggle}>Update Profile</DropdownItem>
                                                <DropdownItem onClick={avatarModalToggle}>Change Avatar</DropdownItem>
                                                <DropdownItem divider />
                                                <DropdownItem onClick={logout}>Logout</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink tag={RRNavLink} to="/">Home</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink tag={RRNavLink} to="/moodwall">Mood Wall</NavLink>
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
                                                    <NavLink tag={RRNavLink} to="/clientlist">My Clients</NavLink>
                                                </NavItem>
                                                <NavItem className="d-flex justify-content-start align-items-center">
                                                    <NavLink tag={RRNavLink} to="/entries">
                                                        Journal Entries
                                                    </NavLink>
                                                    {
                                                        unreadCount > 0 &&
                                                        <Link to="/entries?viewed=false">
                                                            <Badge color="info" className="ml-1 px-2 py-1">
                                                                {unreadCount}
                                                            </Badge>
                                                        </Link>
                                                    }

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
            <Modal isOpen={updateUserModal} toggle={updateUserModalToggle} scrollable={true}>
                <ModalHeader toggle={updateUserModalToggle}>
                    Change Your Profile
            </ModalHeader>
                <ModalBody>
                    <UpdateUserForm toggle={updateUserModalToggle} />
                </ModalBody>
            </Modal>
            <Modal isOpen={avatarModal} toggle={avatarModalToggle} scrollable={true}>
                <ModalHeader toggle={avatarModalToggle}>
                    Change Your Avatar
            </ModalHeader>
                <ModalBody>
                    <AvatarProvider>
                        <ChangeAvatar toggle={avatarModalToggle} />
                    </AvatarProvider>
                </ModalBody>
            </Modal>
        </>
    );
}
