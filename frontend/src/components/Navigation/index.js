// frontend/src/components/Navigation/index.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';
import { Modal } from '../../context/Modal'
import SignupFormModal from '../SignupFormModal';
import SignupForm from '../SignupFormModal/SignupForm';
import LoginForm from '../LoginFormModal/LoginForm';
import CreateSpot from '../CreateSpot/CreateSpot';
import logo from '../logo/logo.png'
import CreateSpotModal from '../CreateSpot';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const [showModal, setShowModal] = useState(false);
  const [login, setLogin] = useState(true);
  const [createModal, setCreateModal] = useState(false)


  let sessionLinks;
  if (sessionUser) {
    sessionLinks = <ProfileButton user={sessionUser} />
  } else {
    sessionLinks = (
      <>
        <LoginFormModal />
        <SignupFormModal />
      </>
    );
  }

  return (
    <div id='topBar'>
          <NavLink exact to="/">
          <img id='logo' src={logo}></img>
          </NavLink>
      <ul className='icons'>
        <li>
          {isLoaded && (
            <ProfileButton
            user={sessionUser}
            setLogin={setLogin}
            setShowModal={setShowModal}
            />
            )}
        </li>
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            {login ? <LoginForm setShowModal={setShowModal} /> :
              <SignupForm setShowModal={setShowModal} />}
          </Modal>
        )}
          {/* <button  hidden={!sessionUser} onClick={() => setCreateModal(true)}>Become a Host</button> */}
          {/* {createModal && ( */}
              <CreateSpotModal />
          {/* // )} */}
      </ul>
      </div>
  );
}

export default Navigation;
