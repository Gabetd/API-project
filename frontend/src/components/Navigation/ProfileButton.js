// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";
import * as sessionActions from '../../store/session';
import CreateSpotModal from "../CreateSpot/index"

function ProfileButton({ user, setLogin, setShowModal }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);


  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };


  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  // if(user && (!user.username && !user.email)) {logout()}

  return (
    <div className="top-bar">
      <button className="user-button" onClick={openMenu}>
      ≡ <i className="fas fa-user-circle" />
      </button>
      {showMenu && ( user ?
        (<ul className="profile-dropdown">
          <li className="li">{user.username}</li>
          <li className="li">{user.email}</li>
          <li className="li">
            <button onClick={logout}>Log Out</button>
          </li>
        </ul>) :
        (
          <ul className="profile-dropdown">
            <li className="li">
              <button
              className="uniform"
                onClick={() => {
                setLogin(true)
                setShowModal(true)
              }}>Log In</button>
            </li>
            <li className="li">
            <button
                className="uniform"
                onClick={() => {
                setLogin(false)
                setShowModal(true)
              }}>Sign Up</button>
            </li>
          </ul>
        )

        )}
    </div>
  );
}

export default ProfileButton;
