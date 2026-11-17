import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

// One Firebase app for the whole frontend.
// (Analytics is intentionally not used.)
export const app = initializeApp(environment.firebase);
export const auth = getAuth(app);
export const db = getFirestore(app); // used by chat (step 6)