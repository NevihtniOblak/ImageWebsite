import { useContext, useState, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {motion, AnimePresence} from 'framer-motion';

import { UserContext } from '../../userContext';
import styles from './Login.module.scss';


function Login({showModal, setShowModal}) {
    const modalRef = useRef();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext); 

    async function Login(e){
        e.preventDefault();

        const csrfRes = await fetch('http://localhost:3001/getCSRFToken', {
            credentials: 'include'
        });
        const csrfToken = await csrfRes.json();

        const res = await fetch("http://localhost:3001/users/login", {
            method: "POST",
            credentials: "include",
            headers: { 
                'Content-Type': 'application/json',
                "X-CSRF-Token": csrfToken.CSRFToken
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await res.json();
        if(data._id !== undefined){
            userContext.setUserContext(data);
            setShowModal(false);
            
        } else {
            setUsername("");
            setPassword("");
            setError("Invalid username or password");
        }
    }

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModal(false);
        }
      };
    
      useEffect(() => {
        if (showModal) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
            setUsername("");
            setPassword("");
            setError("");
        }
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [showModal]);


    if (!showModal) {
    return null;
    }

    return (
        <div className={styles.loginBackground}>

            <motion.div 
                className={styles.loginContainer} 
                ref={modalRef}

                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}

            >

                <form className={styles.form} onSubmit={Login}>
                    {/*userContext.user ? <Navigate replace to="/" /> : ""*/}

                    <div className={styles.fieldContainer}>
                        <input className={styles.inputField} type="text" name="username" placeholder="Username" value={username} onChange={(e)=>(setUsername(e.target.value))}/>

                        <input className={styles.inputField} type="password" name="password" placeholder="Password" value={password} onChange={(e)=>(setPassword(e.target.value))}/>
                    </div>

                    <div className={styles.submitButtonContainer}>
                        <input className={styles.submitButton} type="submit" name="submit" value="Login"/>
                        {/*<label>{error}</label>*/}
                    </div>

                </form>
            </motion.div>
        </div>
    );
}

export default Login;