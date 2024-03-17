


/**
 * A React component that renders a form with input fields for the user to 
 * enter their name, password, and id.
 * @component
 */
import React, { useState } from 'react';
import './MyForm.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateUser from './CreateUser';
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function MyForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [id, setId] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const navigate = useNavigate();
    /**
     * Event handler for username input change.
     * Updates the username state with the new value entered by the user.
     * @param {object} event - The event object.
     */
    const handleInputChangeUsername = (event) => {
        setUsername(event.target.value);
    }

    /**
     * Event handler for password input change.
     * Updates the password state with the new value entered by the user.
     * @param {object} event - The event object.
     */
    const handleInputChangePassword = (event) => {
        setPassword(event.target.value);
    }

    /**
     * Event handler for id input change.
     * Updates the id state with the new value entered by the user.
     * @param {object} event - The event object.
     */
    const handleInputChangeId = (event) => {
        setId(event.target.value);
    }

    /**
     * Event handler for form submission.
     * Prevents the default form submission behavior and logs the form data.
     * @param {object} event - The event object.
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = { username, password }; // Removed ID
        setSubmitted(true);
    
        fetch('process_login', { // Changed to POST request
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if(data.code === 200){
                setLoginMessage("Correct login for user: " + data.username);
                setError(false);
                navigate("/projects", { state: { username: data.username, valid: true } });
            } else {
                setLoginMessage("Response code: " + data.code + " Response message: " + data.error);
                setError(true);
            }
        })
        .catch(error => {
            setLoginMessage("Login failed: " + error.message);
            setError(true);
        });
    }
    

    return (
        <>
                <h1 className='userform'>Login Page</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={username}
                            onChange={handleInputChangeUsername}
                            placeholder="username"
                            required
                        />
                    </label>
                    <br /><br/>
                    <label>
                        ID:
                        <input
                            type="text"
                            value={id}
                            onChange={handleInputChangeId}
                            placeholder="id"
                            required
                        />
                    </label>
                    <br /><br />
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={handleInputChangePassword}
                            placeholder="password"
                            required
                        />
                    </label>
                    <br /><br />
                    <button type="submit">Log In</button>
                    <p>{loginMessage}</p>
                </form>
        </>
    )
}

export default MyForm;

  