import React, { useState } from 'react';
import styles from './FormularioAdministrador.module.css';

const FormularioAdministrador = () => {
    const [productoId, setProductoId] = useState('');
    const [nuevoEstado, setNuevoEstado] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'productoId') {
            setProductoId(value);
        } else if (name === 'nuevoEstado') {
            setNuevoEstado(value);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Aquí puedes realizar la lógica para cambiar el estado del producto
        console.log('Producto ID:', productoId);
        console.log('Nuevo estado:', nuevoEstado);
        // Luego puedes enviar los datos al servidor o realizar otras acciones necesarias
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Producto ID:
                <input
                    type="text"
                    name="productoId"
                    value={productoId}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Nuevo estado:
                <input
                    type="text"
                    name="nuevoEstado"
                    value={nuevoEstado}
                    onChange={handleChange}
                />
            </label>
            <br />
            <button type="submit">Cambiar estado</button>
        </form>
    );
};

export default FormularioAdministrador;
