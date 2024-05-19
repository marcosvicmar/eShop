import React, { useState } from 'react';
import styles from './AddCategoryForm.module.css';

const AddCategoryForm: React.FC = () => {
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Category name:', categoryName);
        setCategoryName('');
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
                Category Name:
                <input
                    type="text"
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    className={styles.input}
                />
            </label>
            <button type="submit" className={styles.button}>Add Category</button>
        </form>
    );
};

export default AddCategoryForm;