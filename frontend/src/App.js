// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupForm from "./components/SignupFormModal";
import LoginForm from "./components/LoginFormModal";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Home from "./components/Home"
import SpotById from "./components/spotById"

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(true);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/signup">
            <SignupForm />
          </Route>
          <Route path="/login">
            <LoginForm />
          </Route>
          <Route path='/spots/:spotId'>
            <SpotById />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
