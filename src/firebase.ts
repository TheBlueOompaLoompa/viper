import { initializeApp } from 'firebase/app';

import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDv0SDv5qwDs16Exbc9mMWIYaUJbJSI_BI",
    authDomain: "viper-312216.firebaseapp.com",
    projectId: "viper-312216",
    storageBucket: "viper-312216.appspot.com",
    messagingSenderId: "183910552904",
    appId: "1:183910552904:web:42bf9b8d25c65d80924f7d"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);