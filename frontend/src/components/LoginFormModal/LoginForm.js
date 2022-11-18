// frontend/src/components/LoginFormModal/LoginForm.js
import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import logo from '../logo/logo.png'

function LoginForm({ setShowModal }) {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);


  useEffect(()=> {
    const errs = []
    if(!credential) errs.push("please input a username or email")
    if(!password) errs.push("please input your password")
    setErrors(errs)
  },[credential, password])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
    .then(() => setShowModal(false))
    .catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
        setErrors(["Please enter valid credential and password"])
      }
      );
  };

  const demoLogin = () => {
    setCredential('Demo-lition');
    setPassword('password');
    dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password'}))
  }

  return (
    <form className='base-form'onSubmit={handleSubmit}>
       <img  className='modal-logo'src={logo} />
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <label>
        Username or Email
        <input
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit" hidden={errors.length !== 0}>Log In</button>
      <button type='submit' onClick={demoLogin}>Log In as Demo User</button>
    </form>
  );
}

export default LoginForm;
