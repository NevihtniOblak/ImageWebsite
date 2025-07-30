import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import styles from "./Register.module.scss";

function Register({ showModal, setShowModal }) {
    const modalRef = useRef();
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [email, setEmail] = useState([]);
    const [error, setError] = useState([]);

    const navigate = useNavigate();

    async function Register(e) {
        e.preventDefault();

        const csrfRes = await fetch("http://localhost:3001/getCSRFToken", {
            credentials: "include",
        });
        const csrfToken = await csrfRes.json();

        const res = await fetch("http://localhost:3001/users", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken.CSRFToken,
            },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
            }),
        });

        const data = await res.json();
        if (data._id !== undefined) {
            setShowModal(false);
        } else {
            setUsername("");
            setPassword("");
            setEmail("");
            setError("Registration failed");
        }
    }

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModal(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
            setUsername("");
            setPassword("");
            setEmail("");
            setError("");
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showModal]);

    if (!showModal) {
        return null;
    }

    return (
        <div className={styles.registerBackground}>
            <motion.div
                className={styles.registerContainer}
                ref={modalRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
            >
                <form className={styles.form} onSubmit={Register}>
                    <div className={styles.fieldContainer}>
                        <input
                            className={styles.inputField}
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            className={styles.inputField}
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <input
                            className={styles.inputField}
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className={styles.submitButtonContainer}>
                        <input className={styles.submitButton} type="submit" name="submit" value="Register" />
                        {/*<label>{error}</label>*/}
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default Register;
