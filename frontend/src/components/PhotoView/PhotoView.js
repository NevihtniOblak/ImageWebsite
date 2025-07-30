import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../userContext';
import Ratings from '../Ratings/Ratings';
import Photo from '../Photo/Photo';
import Comment from '../Comment/Comment';
import { useNavigate } from 'react-router-dom';


import styles from './PhotoView.module.scss';

function PhotoView() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [photo, setPhoto] = useState(null);
    const [content, setContent] = useState('');
    const [comments, setComments] = useState([]);
    const [synchro, setSynchro] = useState(-1);

    const userContext = useContext(UserContext);

    const handleClickOnUser = () => {
        navigate(`/profile/${photo.postedBy._id}`);

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content) {
            alert('Please enter a comment');
            return;
        }
        
        try {
            const csrfRes = await fetch('http://localhost:3001/getCSRFToken', {
                credentials: 'include'
            });
            const csrfToken = await csrfRes.json();

            const res = await fetch('http://localhost:3001/comments', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken.CSRFToken
                },
                body: JSON.stringify({
                    content: content,
                    uploadTime: new Date(),
                    postedOn: id,
                    postedBy: userContext.user._id
                })
            });

            if (!res.ok) {
                throw new Error('Failed to add comment');
            }

            const data = await res.json();
            setComments([...comments, data]);

            setContent('');
            setSynchro(synchro * -1);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const getPhoto = async () => {
            try {
                const res = await fetch(`http://localhost:3001/photos/${id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch photo');
                }
                const data = await res.json();
                setPhoto(data);

                // Set the comments state with the comments from the photo
                if (data && data.comments) {
                    setComments(data.comments);
                }
            } catch (error) {
                console.error(error);
            }
        };

        getPhoto();
    }, [synchro]);

    if (!photo) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>

            <div className={styles.innerContainer}>

                <div className={styles.leftSubContainer}>
                    <div className={styles.titleContainer}>
                        <span className={styles.photoTitle}>{photo.name}</span>
                    </div>
                    <div className={styles.photoContainer}>
                        <img
                            className={styles.photo}
                            src={`http://localhost:3001${photo.path}`}
                            alt={photo.name}
                        />
                        
                    </div>
                    <div className={styles.contentContainer}>
                        <p>{photo.content}</p>
                    </div>

                </div>

                <div className={styles.rightSubContainer}>
                    
                    <div className={styles.userInfoContainer}>
                        <div className={styles.userPictureContainer} onClick={handleClickOnUser}>
                            <img 
                                className={styles.userImage}
                                src={`http://localhost:3001${photo.postedBy.photo_path}`} 
                                alt={photo?.postedBy.username}
                            />
                        </div>
                        <span id={styles.username}>{photo.postedBy.username}</span>
                    </div>

                    <div className={styles.commentsContainer}>
                        <div className={styles.commentsSection}>
                            {comments.length > 0 ? (
                                comments.map(comment => (
                                    <div key={comment._id} className={styles.commentContainer}>
                                    <Comment comment={comment} />
                                    </div>
                                ))
                            ) : (
                                <p>No comments yet.</p>
                            )}
                        </div>

                        <form className={styles.commentForm} onSubmit={handleSubmit}>
                            <textarea className={styles.inputFieldBig} id="comment" value={content} onChange={(e) => setContent(e.target.value)} />
                            <button className={styles.submitButton} type="submit">Post</button>
                        </form>

                    </div>

                    <div className={styles.ratingsContainer}>
                        <Ratings  synchro={synchro} setSynchro={setSynchro} photo={photo} setPhotoState={setPhoto}/>
                    </div>

                    <div className={styles.extraInfoContainer}>
                        <p>{new Date(photo.uploadTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>

                </div>
            </div>
        </div>
    );
}


export default PhotoView;
