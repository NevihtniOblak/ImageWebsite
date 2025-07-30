import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../userContext';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import ChangeProfilePicture from '../ChangeProfilePicture/ChangeProfilePicture';

import styles from './Profile.module.scss';

function Profile(){
    const userContext = useContext(UserContext); 
    const [profile, setProfile] = useState({});
    
    const [pictureCount, setPictureCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [totalLikes, setTotalLikes] = useState(0);

    const { id } = useParams();

    const [showModalChangePicture, setShowModalChangePicture] = useState(false);

    const handleChangePictureClick = (e) => {
      e.preventDefault();
      console.log("Change picture clicked");
      setShowModalChangePicture(true);
    };

    const getProfile = async function(){
        //console.log(userContext.user);
        const res = await fetch(`http://localhost:3001/users/profile/${id}`, { credentials: "include" });
        const data = await res.json();
        console.log(data);
        setProfile(data);
    }

    const getPictureCount = async function(){
        const res = await fetch(`http://localhost:3001/users/pictureCount/${id}`, {credentials: "include"});
        const data = await res.json();
        setPictureCount(data.count);
    }

    const getCommentCount = async function(){
        const res = await fetch(`http://localhost:3001/users/commentCount/${id}`, {credentials: "include"});
        const data = await res.json();
        setCommentCount(data.count);
    }

    const getAllLikes = async function(){
        const res = await fetch(`http://localhost:3001/users/allLikes/${id}`, {credentials: "include"});
        const data = await res.json();
        setTotalLikes(data.count);
        console.log(data.count);
    }

    useEffect(function() {
        async function fetchData() {
            await getProfile();
            getPictureCount();
            getCommentCount();
            getAllLikes();
        }

        fetchData();
    }, [showModalChangePicture]);

    return (
            <div className={styles.container}>

            <ChangeProfilePicture showModal={showModalChangePicture} setShowModal={setShowModalChangePicture} profile={profile} />

                <div className={styles.profileContainer} >

                    <div className={styles.pictureContainer}>
                        <div className={styles.userImageContainer}
                        onClick={userContext.user && id === userContext.user._id ? handleChangePictureClick : null}
                        style={{ cursor: userContext.user && id === userContext.user._id ? 'pointer' : 'default' }}
                        >
                            <img 
                                src={"http://localhost:3001"+profile.photo_path}
                                alt={profile.username}
                            />
                        </div>
                        <span className={styles.username}>
                            {profile.username}
                        </span>
                    </div>

                    <div className={styles.statsContainer}>
                        <span>Pictures posted: {pictureCount}</span>
                        <span>Comments posted: {commentCount}</span>
                        <span>Total likes received: {totalLikes}</span>
                    </div>
                </div>
            </div>

    );
}

export default Profile;