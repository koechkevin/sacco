import firebase from 'firebase';
import env from 'dotenv';
env.config();
const config = process.env.REACT_APP_FIREBASE || '{}';

const firebaseConfig = JSON.parse(config);

firebase.initializeApp(firebaseConfig);

export const database = firebase.database();
