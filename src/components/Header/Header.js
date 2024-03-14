import React, { useState, useContext } from 'react';
import Modal from '../ModalComponent/Modal';
import Register from '../ToDoRegister/Register';
import ToDoLogin from '../ToDoLogin/ToDoLogin';
import { useAuth } from '../AuthContext/AuthContext';
import './Header.css';

function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="header">
            <h1 className="header-title">ToDo List</h1>
            <nav className="header-nav">
                {!isAuthenticated ? (
                    <>
                        <button onClick={() => { setIsModalOpen(true); setModalContent('login'); }}>Login</button>
                        <button onClick={() => { setIsModalOpen(true); setModalContent('register'); }}>Register</button>
                    </>
                ) : (
                    <button onClick={handleLogout}>Logout</button>
                )}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    {modalContent === 'login' ? <ToDoLogin /> : <Register />}
                </Modal>
            </nav>
        </div>

    );
}

export default Header;