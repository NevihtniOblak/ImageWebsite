import { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCamera} from '@fortawesome/free-solid-svg-icons';

import { UserContext } from '../../userContext';

import Photo from '../Photo/Photo';
import SlideMenu from '../SlideMenu/SlideMenu';
import AddPhoto from '../AddPhoto/AddPhoto';

import styles from './Photos.module.scss';

var decay = require('decay');
var hackerHotScore = decay.hackerHot();

function Photos(){

    const userContext = useContext(UserContext); 

    const [photos, setPhotos] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showModalAddPhoto, setShowModalAddPhoto] = useState(false);


    const handleAddPhotoClick = (e) => {
        e.preventDefault();

        if(userContext.user){
            setShowModalAddPhoto(true);
        }
      };

    useEffect(function(){
        const getPhotos = async function(){
            const res = await fetch("http://localhost:3001/photos");
            const data = await res.json();

            //sortiranje po casu - newest first
            if(activeIndex === 0){
                data.sort((a, b) => b.uploadTime.localeCompare(a.uploadTime));
            }
            //sortiranje po hackerScore-u
            if(activeIndex === 1){

                data.sort((a, b) => {
                    var scoreA = hackerHotScore(a.likes, new Date(a.uploadTime));
                    var scoreB = hackerHotScore(b.likes, new Date(b.uploadTime));
                    return scoreB - scoreA;
                });
            }
            //sortiranje po casu - oldest first
            if(activeIndex === 2){
                data.sort((a, b) => a.uploadTime.localeCompare(b.uploadTime));
            }


            setPhotos(data);
        }
        
        getPhotos();
    }, [activeIndex, showModalAddPhoto]); 
    

    return(
        
        <><AddPhoto showModal={showModalAddPhoto} setShowModal={setShowModalAddPhoto} />

        <div className={styles.container}>

            <div className={styles.leftSubContainer}>

                <div className={styles.menuContainer}>

                    <SlideMenu activeIndex={activeIndex} setActiveIndex={setActiveIndex}></SlideMenu>

                </div>
                <div className={styles.photosContainer}>
                    {photos.map(photo => (
                        <Photo key={photo._id}  photo={photo}/>
                    ))}
                </div>
            </div>

            <div className={styles.rightSubContainer}>
                <Link className={styles.uploadButtonContainer} onClick={handleAddPhotoClick}>
                    <FontAwesomeIcon icon={faCamera}/> 
                    <span> Upload</span>
                </Link>
            </div>
        </div>
        </>
    );
}

export default Photos;