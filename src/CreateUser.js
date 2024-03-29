/* eslint-disable no-undef */



/**
 * A React component that renders a form with input fields for the user to 
 * enter their name, password, and id.
 * @component
 */
import React, { useState } from 'react';
import './CreateUser.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

function CreateUser() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setconfirmPassword] = useState('');
    const [id, setId] = useState('');
    const [submitted, setSubmitted] = useState('flase');
    const [error, setError] = useState('false');
    const [createMessage, setCreateMessage] = useState('');

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
     * Event handler for confirm password input change.
     * Updates the confirm password state with the new value entered by the user.
     * @param {object} event - The event object.
     */
    const handleInputChangeConfirmPassword = (event) => {
        setconfirmPassword(event.target.value);
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
        if (password !== confirmpassword) {
            setCreateMessage("Passwords do not match.");
            return;
        }
    
        const data = { username, id, password };
        fetch('/process_signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                setCreateMessage("Created account for user: " + data.username);
                setError(false);
                navigate("/projects", { state: { username: data.username, valid: true } });
            } else {
                setCreateMessage("Response code: " + data.code + " Response message: " + data.error);
                setError(true);
            }
        })
        .catch(error => {
            setCreateMessage("Failed to create account: " + error.message);
            setError(true);
        });
    }
    

    return (
    <>
        <h1 className='createuser'>Create New User</h1>
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
            <label>
                Confirm Password:
                <input
                    type="password"
                    value={confirmpassword}
                    onChange={handleInputChangeConfirmPassword}
                    placeholder="confirm password"
                    required
                />
            </label>
            <br /><br />
            <button type="submit">create</button>
            <br/><br/>
            <p>{createMessage}</p>
        </form>
    </> 
    )
}

export default CreateUser;

  