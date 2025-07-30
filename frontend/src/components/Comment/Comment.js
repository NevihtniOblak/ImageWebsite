
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Comment.module.scss';


function Comment({ comment}) {
    const navigate = useNavigate();


    const handleClickOnUser = () => {
        navigate(`/profile/${comment.postedBy._id}`);

    }


    return (

        <div className={styles.container}>
            <div className={styles.userInfoContainer}>
                <div className={styles.userPictureContainer} onClick={handleClickOnUser}>
                    <img 
                        className={styles.userImage}
                        src={`http://localhost:3001${comment.postedBy.photo_path}`} 
                        alt={comment?.postedBy.username}
                    />
                </div>
                <span id={styles.username}>{comment.postedBy.username}</span>
            </div>
            <div className={styles.contentContainer}>
                <p>{comment.content}</p>
            </div>
        </div>
    );
}

export default Comment;