import firebase from 'firebase';
import 'firebase/firestore'
import { collectionData } from 'rxfire/firestore';

/**
 * Static class for calling and accessing firebase_Auth and firestore database
 */
class Firebase {

  // Configuration for accessing firebase
  static firebaseConfig = {
    apiKey: 'AIzaSyCSUlm9Wv1PhtE_pVdjPs3hbElPgi3D-P0',
    authDomain: 'look-book-85805.firebaseapp.com',
    databaseURL: 'https://look-book-85805.firebaseio.com',
    projectId: 'look-book-85805',
    storageBucket: 'look-book-85805.appspot.com',
    messagingSenderId: '442823595800',
    appId: '1:442823595800:web:56ca4869c440ca55d7b06d',
  };

  // Initialize firebase connection
  static firebase_init = firebase.initializeApp(Firebase.firebaseConfig);

  // Sign in to firebase_auth using email and password 
  static async firebase_signIn(email, password) {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  }

  // Signout from firebase_auth
  static async firebase_signOut() {
    await firebase.auth().signOut();
  }

  // Get current user from firebase_auth
  static auth_getUser() {
    return firebase.auth().currentUser;
  }

  // Create account using email and password 
  static async auth_createAccount(email, password) {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  // Update user profile with given username
  static async auth_updateProfile(username) {
    await this.auth_getUser().updateProfile({displayName: username});
  }

  // Add a like to the give image uid
  static async firestore_addLike(uid, likes) {
    await firebase.firestore().collection('images').doc(uid).update({likes: likes+1});
  }

  // Get all posts from firestore (NOT USED CURRENTLY, WORKING CODE FOUND IN HOMEPAGE)
  static async firestore_getPosts() {
    const dataRef = firebase.firestore().collection('images');
    const imageStream = collectionData(
      dataRef.orderBy('date', 'desc')
    ).subscribe(posts => {
      console.log('Firestore list', posts)
    })
    return imageStream;
  }
  
  // Upload a 'post' with given base64 string
  static firestore_uploadPost(image) {
    dateNow = new Date();                       // Get current date
    idNow = this.auth_getUser().uid + dateNow   // Create unique id for post using date and userid

    // Attempt to add image to firestore
    firebase.firestore().collection('images').doc(idNow).set({
      date: dateNow,
      id: idNow,
      imageURL: image,
      likes: 0,
      name: this.auth_getUser().displayName,
      userId: this.auth_getUser().uid
    })
  }
}

export default Firebase;
