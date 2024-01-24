import React from 'react';
import './ToDoItem.css';

function ToDoItem({ item, onToggle }) {

    const handleChange = () => {
        onToggle(item.id);
    };

    return (
        <div className='todo-item'>
            <input type="checkbox" checked={item.completed} onChange={handleChange} />
            <span className={item.completed ? 'completed' : ''}>{item.description}</span>
        </div>

    )
}

export default ToDoItem;