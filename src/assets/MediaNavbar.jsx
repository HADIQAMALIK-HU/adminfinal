import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab, Nav as TabNav, Form, Button } from 'react-bootstrap';
import './MediaComponents.css';

const MediaNavbar = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleLoginModalOpen = () => setShowLoginModal(true);
    const handleLoginModalClose = () => setShowLoginModal(false);

    return (
        <>
            <Navbar expand="lg" style={{ backgroundColor: '#ffcb08' }}>
    <Container className="d-flex align-items-center justify-content-between">
        {/* Logo aligned center vertically */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img
                alt="Media Logo"
                src="/medialogo.png"
                width="80px"
                height="auto"
                className="d-inline-block align-middle"
            />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="ms-auto align-items-center">
                <div className="add-billboard-button-wrapper">
                    <Link to="/create" className="add-billboard-button navbuttonadd">
                        Add Billboard +
                    </Link>
                </div>
                <div className="add-billboard-button-wrapper">
                    <Link to="/admincareer" className="add-billboard-button navbuttonadd">
                        Admin Career +
                    </Link>
                </div>
            </Nav>
        </Navbar.Collapse>
    </Container>
</Navbar>

        </>
    );
};

export default MediaNavbar;