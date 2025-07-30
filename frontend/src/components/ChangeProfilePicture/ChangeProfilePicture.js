import { useContext, useState, useRef, useEffect } from 'react';
import {motion, AnimePresence} from 'framer-motion';

import { UserContext } from '../../userContext';
import styles from './ChangeProfilePicture.module.scss';

function ChangeProfilePicture({showModal, setShowModal, profile}) {
    const modalRef = useRef();
    const [file, setFile] = useState('');

    let currentPicture = "http://localhost:3001"+profile.photo_path;

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (file !== currentPicture && file) {
            const csrfRes = await fetch('http://localhost:3001/getCSRFToken', {
                credentials: 'include'
            });
            const csrfToken = await csrfRes.json();
            const formData = new FormData();

            formData.append('image', file);

            const res = await fetch('http://localhost:3001/users/picture', {
                credentials: 'include',
                headers: {
                    'X-CSRF-Token': csrfToken.CSRFToken
                },
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            
            setShowModal(false);
            // Handle response if needed
        } else {
            setShowModal(false);
        }
    };

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
        setFile(null);

    }
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
    }, [showModal]);


    if (!showModal) {
    return null;
    }

    return (
        <div className={styles.ChangePictureBackground}>
            <motion.div
                className={styles.ChangePictureContainer}
                ref={modalRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >              

                <form className={styles.formContainer}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        id="imageUpload"
                    />

                    <label htmlFor="imageUpload" className={styles.imagePreviewContainer}>
                        <img
                            src={file ? URL.createObjectURL(file) : currentPicture}
                            alt="Selected"
                            className={styles.imagePreview}
                        />
                    </label>

                    <button className={styles.submitButton} type="button" onClick={handleSubmit}>
                        Change picture
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

export default ChangeProfilePicture;