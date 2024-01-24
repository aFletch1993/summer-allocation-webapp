import React from 'react';
import Header from './components/Header/Header';
import ToDoList from './components/ToDoList/ToDoList';
import Footer from './components/Footer/Footer';
import './MainApp.css';

function MainApp() {
    return (
        <div className="main-app">
            <Header />
            <ToDoList />
        </div>
    );
}

export default MainApp;