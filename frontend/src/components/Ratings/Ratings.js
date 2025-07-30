import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeartBroken } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { UserContext } from '../../userContext';

import styles from'./Ratings.module.scss';

function Ratings({ photo, setPhotoState, synchro, setSynchro }) {

    const userContext = useContext(UserContext); 

    let isFlagged = userContext.user ? photo.redFlaggedBy.includes(userContext.user._id) : false;
    let isLiked = userContext.user ? photo.likedBy.includes(userContext.user._id) : false;
    let isDisliked = userContext.user ? photo.dislikedBy.includes(userContext.user._id) : false;

    const handleRate = async (photoId, action) => {
        try {
            const csrfRes = await fetch('http://localhost:3001/getCSRFToken', {
                credentials: 'include'
            });
            const csrfToken = await csrfRes.json();

            const res = await fetch('http://localhost:3001/photos/rate', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken.CSRFToken
                },
                body: JSON.stringify({
                    photoId: photoId,
                    action: action,
                })
            });
    
            if (!res.ok) {
                throw new Error(`Failed to ${action} photo`);
            }

            const data = await res.json();

            setPhotoState(data);
            setSynchro(synchro*-1);

    
        } catch (error) {
            console.error(error);
        }
    };

    const handleFlag = async (photoId) => {
        try {
            const csrfRes = await fetch('http://localhost:3001/getCSRFToken', {
                credentials: 'include'
            });
            const csrfToken = await csrfRes.json();

            const res = await fetch('http://localhost:3001/photos/flag', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken.CSRFToken
                },
                body: JSON.stringify({
                    photoId: photoId,
                })
            });
    
            if (!res.ok) {
                throw new Error(`Failed to report photo`);
            }

            const data = await res.json();

            setPhotoState(data);
            setSynchro(synchro*-1);


        } catch (error) {
            console.error(error);
        }
    };

    return (

        <div className={styles.ratingsContainer}>
            
            <div className={styles.likeContainer}>
                <div>
                    <FontAwesomeIcon
                        icon={faHeart}
                        className={`${styles.likeButton} ${isLiked ? styles.likeActive : ''}`}
                        onClick={() => handleRate(photo._id, 'like')}
                    />
                </div>
                <div>
                    <FontAwesomeIcon
                        icon={faHeartBroken}
                        className={`${styles.dislikeButton} ${isDisliked ? styles.dislikeActive : ''}`}
                        onClick={() => handleRate(photo._id, 'dislike')}
                    />
                </div>

                <div className={styles.likeCountContainer}>
                    {photo ? (
                        <>
                            <span id = {styles.likeCount}>{photo.likes}</span>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>

            <div className={styles.flagContainer}>
                <FontAwesomeIcon 
                    icon={faFlag}   
                    onClick={() => handleFlag(photo._id)}
                    className={`${styles.flagButton} ${isFlagged ? styles.active : ''}`}
                />
            </div>

        </div>
    );
}

export default Ratings;
