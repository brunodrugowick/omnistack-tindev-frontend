import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Main.css';

import webSocketClient from 'socket.io-client';

import api from '../services/api';

import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsamatch from '../assets/itsamatch.png';

function Main(props) {

    const [users, setUsers] = useState([]);
    const [matchDeveloper, setMatchDeveloper] = useState(null);

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

    useEffect(() => {
        const socket = webSocketClient.connect(process.env.REACT_APP_API, {
            query: { user: props.match.params.id },
        });

        socket.on('match', developer => {
            setMatchDeveloper(developer);
        });

        socket.on('app_restart', () => {
            console.log("Server issued a restart. Getting new list of developers.")
            async function loadUsers() {
                const response = await api.get('/developers', {
                    headers: {
                        user: props.match.params.id,
                    }
                });
                setMatchDeveloper(null);
                setUsers(response.data.docs);
            }
    
            loadUsers();
        });
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

            <ul>    
                <li>
                    <footer>
                        <strong><a 
                            href={process.env.REACT_APP_API + "/controlPanel"}
                            target="_blank" rel='noreferrer noopener'
                        >Control Panel</a></strong>
                        <p>This is taking you to an endpoint served by the backend, 
                            in a server-side rendered page with some VueJS-implemented 
                            functions. <br/> Why? Just for fun...</p>
                    </footer>
                </li>
            </ul>

            { matchDeveloper && (
                <div className="match-container">
                    <img src={itsamatch} alt="It's a match"/>
                    <img className="avatar" src={matchDeveloper.avatar} alt={matchDeveloper.name}/>
                    <strong>{matchDeveloper.name}</strong>
                    <p>{matchDeveloper.bio}</p>

                    <button type="button" onClick={() => setMatchDeveloper(null)}>FECHAR</button>
                </div>
             ) } 
        </div>
    );
}

export default Main;