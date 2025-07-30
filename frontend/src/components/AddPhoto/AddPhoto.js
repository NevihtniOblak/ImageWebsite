import { useContext, useState, useRef, useEffect } from 'react'
import { Navigate } from 'react-router';
import { UserContext } from '../../userContext';
import {motion, AnimePresence} from 'framer-motion';


import styles from './AddPhoto.module.scss';


function AddPhoto({showModal, setShowModal}) {
    const userContext = useContext(UserContext); 

    const modalRef = useRef();
    const[title, setTitle] = useState('');
    const[file, setFile] = useState('');
    const[content, setContent] = useState('');

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModal(false);
        }
      };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };
    
      useEffect(() => {
        if (showModal) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
            setTitle('');
            setFile('');
            setContent('')
        }
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [showModal]);

    async function onSubmit(e){
        e.preventDefault();

        
        const csrfRes = await fetch('http://localhost:3001/getCSRFToken', {
            credentials: 'include'
        });
        const csrfToken = await csrfRes.json();        

        if(!title){
            alert("Vnesite ime!");
            return;
        }

        const formData = new FormData();
        formData.append('name', title);
        formData.append('image', file);
        formData.append('content', content);

        console.log(file);

        const res = await fetch('http://localhost:3001/photos', {
            method: 'POST',
            credentials: 'include',
            headers: { 
                "X-CSRF-Token": csrfToken.CSRFToken
            },
            body: formData
        });
        
        const data = await res.json();

        setShowModal(false);

    }

    if (!showModal) {
        return null;
        }

    return (
        <motion.div 
            className={styles.addPhotoBackground}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            
            >

            <div 
                className={styles.container} 
                ref={modalRef}>
                
                <form className={styles.formContainer} onSubmit={onSubmit}>

                    <div className={styles.titleContainer}>
                        <input type="text" className={styles.inputField} name="ime" placeholder=" Title" value={title} onChange={(e)=>{setTitle(e.target.value)}}/>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        id="imageUpload"
                    />

                    <label htmlFor="imageUpload" className={styles.imagePreviewContainer}>
                        {file && (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Selected"
                                className={styles.imagePreview}
                            />
                        )}
                    </label>


                    <div className={styles.descriptionContainer}>
                        <textarea className={styles.inputField} name="content" placeholder="Content" required onChange={(e)=>{setContent(e.target.value)}}></textarea>
                    </div> 

                    <div className={styles.submitButtonContainer}>
                        <input className={styles.submitButton} type="submit" name="submit" value="Upload" />
                    </div>

                </form>
            </div>
        </motion.div>
    )
}

export default AddPhoto;