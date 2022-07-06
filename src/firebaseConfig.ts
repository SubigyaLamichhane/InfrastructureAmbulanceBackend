import { initializeApp } from 'firebase-admin/app';
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';

const firebaseConfig = {
  credential: admin.credential.cert({
    clientEmail: process.env.CLIENT_EMAIL,
    //@ts-ignore
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    projectId: process.env.PROJECT_ID,
  }),
};

const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
