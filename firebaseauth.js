
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
  import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCa2CpAsk6P3nDYH4F-fUnQMOXI_F-00Xs",
    authDomain: "login-form-1b286.firebaseapp.com",
    projectId: "login-form-1b286",
    storageBucket: "login-form-1b286.firebasestorage.app",
    messagingSenderId: "405509312103",
    appId: "1:405509312103:web:21156c6e2cc8b0a57d0ec2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  
  setTimeout(function() {
    messageDiv.style.opacity = 0;
    messageDiv.style.display = "none";
  }, 5000);
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const signUp = document.getElementById('submitSignUp');
  
  signUp.addEventListener('click', (event) => {
    event.preventDefault();
    
    const email = document.getElementById('remail').value;
    const password = document.getElementById('rpassword').value;
    const name = document.getElementById('name').value;

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          email: email,
          name: name
        };

        showMessage('Account Created Successfully', 'signUpMessage');

        const docRef = doc(db, "users", user.uid);
        return setDoc(docRef, userData);
      })
      .then(() => {
        window.location.href = 'login.html';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error("Signup Error:", errorCode, errorMessage);

        switch(errorCode) {
          case 'auth/email-already-in-use':
            showMessage('Email is already in use', 'signUpMessage');
            break;
          case 'auth/invalid-email':
            showMessage('Invalid email address', 'signUpMessage');
            break;
          case 'auth/weak-password':
            showMessage('Password is too weak', 'signUpMessage');
            break;
          default:
            showMessage('Signup failed. Please try again.', 'signUpMessage');
        }
      });
  });
});