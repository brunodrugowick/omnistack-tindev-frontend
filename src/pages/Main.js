import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Main.css';

import api from '../services/api';

import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';

function Main(props) {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/developers', {
                headers: {
                    user: props.match.params.id,
                }
            });

            setUsers(response.data.docs);
        }

        loadUsers();
    }, [props.match.params.id]);

    async function handleLike(id) {
        await api.post(`/developers/${id}/likes`, null, {
            headers: { user: props.match.params.id },
        });

        setUsers(users.filter(user => user._id !== id));
    }

    async function handleDislike(id) {
        await api.post(`/developers/${id}/dislikes`, null, {
            headers: { user: props.match.params.id },
        });

        setUsers(users.filter(user => user._id !== id));
    }

    return(
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="Tindev" />
            </Link>
            { users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            <img src={user.avatar} alt={user.name}/>
                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                            </footer>
        
                            <div className="buttons">
                                <button type="button" onClick={() => handleDislike(user._id)}>
                                    <img src={dislike} alt="Dislike"/>
                                </button>
                                <button onClick={() => handleLike(user._id)}>
                                    <img src={like} alt="Like"/>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="empty">No more devs to match =P</div>
            )} 
        </div>
    );
}

export default Main;