import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Ratings from '../Ratings/Ratings';

import styles from './Photo.module.scss';


function Photo({ photo }) {

    const navigate = useNavigate();
    const [photoState, setPhotoState] = useState(photo);


    const handleClickOnUser = () => {
        navigate(`/profile/${photo.postedBy._id}`);

    }

    const handleClickOnImage = () => {
        navigate(`/photos/${photo._id}`);
        console.log("id is "+photo._id);
    }

    return (

        <div className={styles.photoContainer}>

            <div className={styles.userContainer} onClick={handleClickOnUser}>
                <div className={styles.userImageContainer}>
                    <img 
                        src={`http://localhost:3001${photo.postedBy.photo_path}`}
                        alt={photo.postedBy.username}
                    />
                </div>
                <span className={styles.username}>{photo.postedBy.username}</span>
            </div>

            <div className={styles.titleContainer}>
                <span className={styles.photoTitle}>{photo.name}</span>
            </div>

            <div className = {styles.imgContainer}>
                <img 
                    className={styles.image}
                    src={`http://localhost:3001${photo.path}`} 
                    alt={photo.name}
                    onClick={handleClickOnImage}
                />
            </div>

            <div className={styles.ratingsContainer}>
                <Ratings 
                    photo = {photoState} setPhotoState = {setPhotoState}
                />
            </div>

        </div>
    );
}

export default Photo;