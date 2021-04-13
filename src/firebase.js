import firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';
import { user, notes, notifications } from './store';

let loggedInUser = {};
let displayedNotes = [];
let openNotifications = [];

user.subscribe((value) => (loggedInUser = value));
notes.subscribe((value) => (displayedNotes = value));
notifications.subscribe((value) => (openNotifications = value));

const firebaseConfig = {
  apiKey: 'AIzaSyDcJBSQP0S3UFquE6JJ37ehmYSic_JTdgc',
  authDomain: 'carbon-suite-notes.firebaseapp.com',
  projectId: 'carbon-suite-notes',
  storageBucket: 'carbon-suite-notes.appspot.com',
  messagingSenderId: '737443528070',
  appId: '1:737443528070:web:f760302be9f05ff5894007',
  measurementId: 'G-7GNDC9KQLR',
};

export const app = (() => {
  if (!firebase.apps.length) {
    return firebase.initializeApp(firebaseConfig);
  } else {
    return firebase.app();
  }
})();

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const fb = firebase;
export const db = firebase.firestore();

export const writeUserData = async (userId, name, email, imageUrl) => {
  const docRef = db.collection('users').doc(userId);
  await docRef.set({
    username: name,
    email: email,
    profile_image: imageUrl,
    notes: [],
  });
};

export const writeNote = async (note) => {
  const noteId = uuidv4();
  const noteRef = db.collection('notes').doc(noteId);
  await noteRef.set({
    id: noteId,
    createdAt: new Date(),
    contents: note.contents,
    title: note.title,
    owner: note.owner,
    inTrash: false,
    inArchive: false,
  });
};

export const updateNote = async (noteId, title, contents) => {
  await db.collection('notes').doc(noteId).update({
    title,
    contents,
  });
};

export const archiveNote = async (noteId) => {
  await db.collection('notes').doc(noteId).update({ inArchive: true });
};

export const trashNote = async (noteId) => {
  await db.collection('notes').doc(noteId).update({ inTrash: true });
};

export const listenForUserNoteUpdates = async () => {
  const query = db
    .collection('notes')
    .where('owner', '==', loggedInUser.uid)
    .orderBy('createdAt');
  query.onSnapshot(
    (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          notes.set([...displayedNotes, change.doc.data()]);
        }

        if (change.type === 'modified') {
          const updatedNote = change.doc.data();
          notes.set(
            displayedNotes.map((note) =>
              updatedNote.id === note.id ? updatedNote : note,
            ),
          );
        }

        if (change.type === 'removed') {
          const removedNote = change.doc.data();
          notes.set(
            displayedNotes.filter((note) => note.id !== removedNote.id),
          );
        }
      });
    },
    (err) => {
      console.error('Encountered error: ', err);
    },
  );
};
