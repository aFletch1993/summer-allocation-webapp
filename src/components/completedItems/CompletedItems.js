import React from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import './CompletedItems.css';

function CompletedItems({ completedItems, onDelete }) {
     const { isAuthenticated, user } = useAuth();
    const category1 = completedItems.filter((item, index) => index % 2 === 0);
    const category2 = completedItems.filter((item, index) => index % 2 !== 0);

    const isSuperuser = user?.role === 'postgres';

    const handleDelete = (itemId) => {
        if(!isAuthenticated) {
            alert('You lack the required permissions to do this. You should not be here.');
            return;
        }
        if (!isSuperuser) {
            alert('You lack the required permission for deletion.');
            return;
        }
        onDelete(itemId);
    }

    return (
        <div className="completed-items-container">
            <div className="completed-category">
                <h3>Morning</h3>
                {category1.map(item => (
                    <div key={item.id} className="completed-item">
                        {item.description}
                        {isAuthenticated && (
                             <button className="delete-button" onClick={() => handleDelete(item.id)}>Delete</button>
                        )}
                    </div>
                ))}
            </div>
            <div className="completed-category">
                <h3>Afternoon</h3>
                {category2.map(item => (
                    <div key={item.id} className="completed-item">
                        {item.description}
                        {isAuthenticated && (
                        <button className="delete-button" onClick={() => handleDelete(item.id)}>Delete</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CompletedItems;