import firebase from 'firebase';
import 'firebase/firestore'
import { collectionData } from 'rxfire/firestore';

class Firebase {

  static firebaseConfig = {
    apiKey: 'AIzaSyCSUlm9Wv1PhtE_pVdjPs3hbElPgi3D-P0',
    authDomain: 'look-book-85805.firebaseapp.com',
    databaseURL: 'https://look-book-85805.firebaseio.com',
    projectId: 'look-book-85805',
    storageBucket: 'look-book-85805.appspot.com',
    messagingSenderId: '442823595800',
    appId: '1:442823595800:web:56ca4869c440ca55d7b06d',
  };

  static firebase_init = firebase.initializeApp(Firebase.firebaseConfig);

  static async firebase_signIn(email, password) {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  }

  static async firebase_signOut() {
    await firebase.auth().signOut();
  }

  static auth_getUser() {
    return firebase.auth().currentUser;
  }

  static async firebase_signOut() {
    await firebase.auth().signOut();
  }

  static async auth_createAccount(email, password) {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  static async auth_updateProfile(username) {
    await this.auth_getUser().updateProfile({displayName: username});
  }

  static async firestore_addLike(uid, likes) {
    await firebase.firestore().collection('images').doc(uid).update({likes: likes+1});
  }

  static async firestore_getPosts() {
    const dataRef = firebase.firestore().collection('images');
    const imageStream = collectionData(
      dataRef.orderBy('date', 'desc')
    ).subscribe(posts => {
      console.log('Firestore list', posts)
    })
    return imageStream;
  }

  static async firestore_getPostsFake() {
    return [
      {txt: 'fdas'}, {txt: 'huh'}, {txt: 'cool'}
    ]
  }
  
  static firestore_uploadPost(image) {
    dateNow = new Date();
    idNow = this.auth_getUser().uid + dateNow

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
