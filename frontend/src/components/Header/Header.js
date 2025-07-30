import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../userContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import Login from '../Login/Login';
import Register from "../Register/Register";

import styles from './Header.module.scss';



function Header() {

    const [showModalLogin, setShowModalLogin] = useState(false);
    const [showModalRegister, setShowModalRegister] = useState(false);

    const handleLoginClick = (e) => {
      e.preventDefault();
      setShowModalLogin(true);
    };

    const handleRegisterClick = (e) => {
        e.preventDefault();
        setShowModalRegister(true);
    };
  

    return (
        

        <header id={styles.header}>
            <Login showModal={showModalLogin} setShowModal={setShowModalLogin} />
            <Register showModal={showModalRegister} setShowModal={setShowModalRegister} />
            
            <div id={styles.titleContainer}>
                <h1 id={styles.title} > Photospace </h1>
            </div>
            <nav id={styles.navigation}>
                <ul id={styles.linkList}>

                    <li className={styles.menuItem}>
                        <Link className={styles.menuLink} to='/'>                
                            <FontAwesomeIcon className={styles.icons} icon={faHome} /> 
                            <span>Home</span>
                        </Link>
                    </li>
                    {/* 
                    <li className={styles.menuItem}>
                        <Link className={styles.menuLink} to='/trending'>
                            <span>Trending</span>
                        </Link>
                    </li>
                    */}
                    <UserContext.Consumer>
                        {context => (
                            console.log(context.user),
                            context.user ?
                                <>
                                    {/* 
                                    <li className={styles.menuItem}>
                                        <Link className={styles.menuLink} to='/publish'>
                                            <span>Publish</span>
                                        </Link>
                                    </li>
                                    */}
                                    <li className={styles.menuItem}>
                                    <Link className={styles.menuLink} to={`/profile/${context.user._id}`}>                                            <FontAwesomeIcon className={styles.icons} icon={faUser} />
                                            <span>Profile</span>
                                        </Link>
                                    </li>
                                    <li className={styles.menuItem}>
                                        <Link className={styles.menuLink} to='/logout'>
                                            <span>Logout</span>
                                        </Link>
                                    </li>
                                </>
                            :
                                <>
                                    <li className={styles.menuItem}>
                                        <Link className={styles.menuLink} onClick = {handleLoginClick}>
                                            <span>Login</span>
                                        </Link>
                                    </li>
                                    <li className={styles.menuItem}>
                                        <Link className={styles.menuLink} onClick = {handleRegisterClick}>
                                            <span>Register</span>
                                        </Link>
                                    </li>
                                </>
                        )}
                    </UserContext.Consumer>
                </ul>
            </nav>

            

        </header >

        
    );
}

export default Header;