import React, { useState, useEffect } from 'react';
import ToDoItem from './ToDoItem';
import CompletedItems from '../completedItems/CompletedItems';
import { useAuth } from '../AuthContext/AuthContext'; // Adjust the import path as necessary

import './ToDoList.css';

function ToDoList() {
    const { isAuthenticated, userToken } = useAuth(); // Use userToken for authenticated requests
    const [items, setItems] = useState([]);
    const [completedItems, setCompletedItems] = useState([]);
    const [newItem, setNewItem] = useState("");

    useEffect(() => {
        // Conditional data fetching based on authentication
        if (isAuthenticated) {
            fetch('http://localhost:3001/api/waitlist', {
                headers: {
                    'Authorization': `Bearer ${userToken}`, // Use the token for secure requests
                },
            })
                .then(response => response.json())
                .then(data => setItems(data))
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [isAuthenticated, userToken]); // React to changes in authentication state

    const handleAddItem = (event) => {
        event.preventDefault();
        if (!newItem.trim()) return;

        const newItemObject = {
            description: newItem,
            completed: false
        };

        if (isAuthenticated) {
            fetch('http://localhost:3001/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`, // Secure the request with the token
                },
                body: JSON.stringify(newItemObject),
            })
            .then(response => response.json())
            .then(data => {
                setItems(prevItems => [...prevItems, data]);  // 'data' contains the new item with its ID
                setNewItem("");
            })
            .catch(error => console.error('Error adding item:', error));
        }
    };

    const onToggle = (itemId) => {
        if (!isAuthenticated) return;
    
        const item = items.find(item => item.id === itemId);
        if (!item) return;
    
        const updatedItem = { ...item, completed: !item.completed };
    
        fetch(`http://localhost:3001/api/waitlist/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
            body: JSON.stringify(updatedItem),
        })
        .then(response => response.json())
        .then(data => {
            setItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, completed: data.completed } : item));
        })
        .catch(error => console.error('Error updating item:', error));
    };
/*
    const onUpdate = (itemId, updatedData) => {
        if (!isAuthenticated) return;
    
        fetch(`http://localhost:3001/api/waitlist/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
            body: JSON.stringify(updatedData),
        })
        .then(response => response.json())
        .then(data => {
            setItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, ...data } : item));
        })
        .catch(error => console.error('Error updating item:', error));
    };
*/
    const onDelete = (itemId) => {
        if (!isAuthenticated) return;
    
        fetch(`http://localhost:3001/api/waitlist/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
        .then(response => {
            if (response.ok) {
                setItems(prevItems => prevItems.filter(item => item.id !== itemId));
                setCompletedItems(prevCompleted => prevCompleted.filter(item => item.id !== itemId));
            } else {
                throw new Error('Error deleting item');
            }
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            {!isAuthenticated ? (
                <div>
                    <Link to='/login'><button>Login</button></Link>
                    <Link to='/register'><button>Register</button></Link>
                </div>
            ) : (
                <div>
                    <button onClick={logout}>Logout</button>
                </div>
            )}
            <div className="todo-list-container">
                <form onSubmit={handleAddItem} className="todo-form">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Add a new task"
                        className="todo-input"
                    />
                    <button type="submit" className="add-button">Add</button>
                </form>
                <div className="todo-list">
                    {items.map(item => (
                        <ToDoItem key={item.id} item={item} onToggle={onToggle} />
                    ))}
                </div>
            </div>
            <CompletedItems completedItems={completedItems} onDelete={onDelete}/>
        </div>
    );
}

export default ToDoList;