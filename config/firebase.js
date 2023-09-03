import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDt-HAZbM9cTnzQFmuAQqLzy_yXgs33Ufk',
  authDomain: 'netrobase-1e8b5.firebaseapp.com',
  projectId: 'netrobase-1e8b5',
  storageBucket: 'netrobase-1e8b5.appspot.com',
  messagingSenderId: '22764299596',
  appId: '1:22764299596:web:eb25c81500f85ada725be9',
  measurementId: 'G-9CWQPKS3P6',
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
