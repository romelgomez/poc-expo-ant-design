import firebase from "firebase/app";
import "firebase/database";
import environment from "./environment";

firebase.initializeApp(environment.firebase);

export default firebase;
