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
    photo: '',
    error: ''
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth()
      .signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
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
      .catch(err => console.log(err.message))
  }


  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6
      const isPasswordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && isPasswordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (e) => {
    if(user.email && user.password){
      // console.log("submitting");
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    console.log(res);
  })
  .catch(error => {
   const newUserInfo = {...user};
   newUserInfo.error = error.message;
   setUser(newUserInfo);
  });
    }
    e.preventDefault();
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
          <img src={user.photo} alt="" />
        </div>
      }
      <h4>Name: {user.name}</h4>
      <h4>Email:{user.email}</h4>
      <h4>Password:{user.password}</h4>
      <form action="" onSubmit= {handleSubmit}>
        <input type="text" name="name" onBlur={handleBlur} id="" placeholder="name"/>
        <br/>
        <input type="text" onBlur={handleBlur} name="email" id="" placeholder="email" required />
        <br />
        <input type="password" onBlur={handleBlur} name="password" id="" placeholder="password" required />
        <br />
        <button type="submit">submit</button>
      </form>

      <h4 style={{color: "red"}}>{user.error}</h4>


    </div>
  );
}

export default App;
