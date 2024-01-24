import React, { useState } from 'react';
import ToDoItem from './ToDoItem';
import CompletedItems from '../completedItems/CompletedItems';
import './ToDoList.css';

function ToDoList() {

    const [items, setItems] = useState([]);
    const [ completedItems, setCompletedItems ] = useState([]);
    const [newItem, setNewItem] = useState("");

    const handleAddItem = (event) => {
        event.preventDefault();
        if (!newItem.trim()) return;
        const newItemObject = {
            id: Date.now(),
            description: newItem,
            completed: false
        };
        setItems([...items, newItemObject]);
        setNewItem("");
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

const onDelete = (itemId) => {
    setCompletedItems(prevItems => prevItems.filter(item => item.id !== itemId));
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