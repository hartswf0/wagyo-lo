// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getDatabase, ref, update, push } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiOItpwsD-EtTz4dDSbehrfq1731XcYdc",
  authDomain: "wagyo-build.firebaseapp.com",
  projectId: "wagyo-build",
  storageBucket: "wagyo-build.appspot.com",
  messagingSenderId: "314101360926",
  appId: "1:314101360926:web:e7c2d169ad9cc4ddcb010f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();
const dataRef = ref(db,'data');
const keydatabase = push(dataRef).key;
// const update = {};
// console.log(keydatabase);
// update["test"] = "yes";
// database.ref('data/'+keydatabase).update(update);

export function saveData(prompt, code, iteration = 0, favorite = false, revise = false, revisePrompt = ''){
  
  const data = {
    prompt,
    code,
    date: new Date(),
    iteration,
  };

  if (revise) {
    data.revise = revise;
    data.revise_prompt = revisePrompt;
  }

  data.favorite = favorite;
  
  update(ref(db, 'data/'+ keydatabase + "-" + iteration), data);
}


