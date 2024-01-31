import React, { useState, useEffect } from 'react';
import ToDoItem from './ToDoItem';
import CompletedItems from '../completedItems/CompletedItems';
import './ToDoList.css';

function ToDoList() {
    const [items, setItems] = useState([]);
    const [completedItems, setCompletedItems] = useState([]);
    const [newItem, setNewItem] = useState("");

    useEffect(() => {
        fetch('http://localhost:3001/api/waitlist')
            .then(response => response.json())
            .then(data => setItems(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleAddItem = (event) => {
        event.preventDefault();
        if (!newItem.trim()) return;

        const newItemObject = {
            description: newItem,
            completed: false
        };

        fetch('http://localhost:3001/api/waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItemObject),
        })
        .then(response => response.json())
        .then(data => {
            setItems(prevItems => [...prevItems, data]);  // 'data' contains the new item with its ID
            setNewItem("");
        })
        .catch(error => console.error('Error adding item:', error));
    };

    const onToggle = (itemId) => {
        setItems(prevItems => {
            const newItems = prevItems.filter(item => item.id !== itemId);
            const completedItem = prevItems.find(item => item.id === itemId);
    
            if (completedItem) {
                setCompletedItems(prevCompleted => {
                    if(!prevCompleted.some(item => item.id === completedItem.id)) {
                        return [...prevCompleted, {...completedItem, completed: true}]
                    }
                    return prevCompleted;
                })
            }
            return newItems;
        });
    };

    const onUpdate = (itemId, updatedData) => {
        fetch(`http://localhost:3001/api/waitlist/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then(response => response.json())
        .then(data => {
            setItems(prevItems => prevItems.map(item => item.id === itemId ? data : item));
        })
        .catch(error => console.error('Error updating item:', error));
    };

    const onDelete = (itemId) => {
        fetch(`http://localhost:3001/api/waitlist/${itemId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                setCompletedItems(prevItems => prevItems.filter(item => item.id !== itemId));
            } else {
                throw new Error('Error deleting waitlist');
            }
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div>
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