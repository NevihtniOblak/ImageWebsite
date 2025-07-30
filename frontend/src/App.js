import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContext } from "./userContext";
import Header from "./components/Header/Header";
import Photos from "./components/Photos/Photos";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Profile from "./components/Profile/Profile";
import Logout from "./components/Logout/Logout";
import AddPhoto from "./components/AddPhoto/AddPhoto";
import PhotoView from "./components/PhotoView/PhotoView";

import styles from "./App.module.scss";

function App() {
    const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
    const updateUserData = (userInfo) => {
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
    };

    useEffect(() => {
        const checkSession = async () => {
            console.log("Checking session");
            const res = await fetch(`http://localhost:3001/users/checkSession`, { credentials: "include" });
            const data = await res.json();
            if (!data.success) {
                updateUserData(null);
            }
        };
        checkSession();
    }, []);

    return (
        <BrowserRouter>
            <UserContext.Provider
                value={{
                    user: user,
                    setUserContext: updateUserData,
                }}
            >
                <div className={styles.App}>
                    <Header></Header>
                    <Routes>
                        <Route path="/" exact element={<Photos />}></Route>
                        <Route path="/login" exact element={<Login />}></Route>
                        <Route path="/register" element={<Register />}></Route>
                        <Route path="/publish" element={<AddPhoto />}></Route>
                        <Route path="/profile/:id" element={<Profile />}></Route>
                        <Route path="/logout" element={<Logout />}></Route>

                        <Route path="/photos/:id" element={<PhotoView />}></Route>
                    </Routes>
                </div>
            </UserContext.Provider>
        </BrowserRouter>
    );
}

export default App;
