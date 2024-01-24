import React from 'react';
import './CompletedItems.css';

function CompletedItems({ completedItems, onDelete }) {
    const category1 = completedItems.filter((item, index) => index % 2 === 0);
    const category2 = completedItems.filter((item, index) => index % 2 !== 0);

    return (
        <div className="completed-items-container">
            <div className="completed-category">
                <h3>Morning</h3>
                {category1.map(item => (
                    <div key={item.id} className="completed-item">
                        {item.description}
                        <button className="delete-button" onClick={() => onDelete(item.id)}>Delete</button>
                    </div>
                ))}
            </div>
            <div className="completed-category">
                <h3>Afternoon</h3>
                {category2.map(item => (
                    <div key={item.id} className="completed-item">
                        {item.description}
                        <button className="delete-button" onClick={() => onDelete(item.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CompletedItems;