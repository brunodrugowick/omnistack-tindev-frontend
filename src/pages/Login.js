import React, { useState } from 'react';
import './Login.css';

import apii from '../services/api';

import logo from '../assets/logo.svg';

function Login(props) {
    const [username, setUsername] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        
        const response = await apii.post('/developers', {
            username
        });

        const { _id } = response.data;

        props.history.push(`/dev/${_id}`);
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Tindev"/>
                <input 
                    type="text" 
                    className="text"
                    placeholder="GitHub Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <button className="submit">Find your <i>dev mate</i></button>
            </form>

        </div>
    );
}

export default Login;