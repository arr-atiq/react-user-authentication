import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';
firebase.initializeApp(firebaseConfig);
function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth()
      .signInWithPopup(provider)
      .then(res =>{
        const {displayName,photoURL,email} = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
      })
      .catch(err => console.log(err.message))
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: ''
      }
      setUser(signedOutUser);
    })
    .catch(err =>console.log(err.message))
  }


  const handleBlur = (e) =>{
    console.log(e.target.name, e.target.value);
    if(e.target.name === "email"){
      const isEmailValid = /\S+@\S+\.\S+/.test(e.target.value)
      console.log(isEmailValid);
    }
    if(e.target.name === "password"){
      const isPasswordValid = e.target.value.length>6
      const isPasswordHasNumber = /\d{1}/.test(e.target.value);
      console.log(isPasswordValid && isPasswordHasNumber);
    }
  }
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> :
        <button onClick={handleSignIn}>Sign in</button>
      }
      {
        user.isSignedIn && 
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }

      <form action="">
        <input type="text" onBlur={handleBlur} name="email" id="" required/>
        <br/>
        <input type="password" onBlur={handleBlur} name="password" id="" required/>
        <br/>
        <button type="submit">submit</button>
      </form>




    </div>
  );
}

export default App;
