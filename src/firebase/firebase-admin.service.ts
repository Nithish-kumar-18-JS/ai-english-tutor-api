import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      console.log('✅ Firebase Admin initialized successfully');
    }
  }

  async verifyIdToken(idToken: string) {
    try {
      return admin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.log("Service : FirebaseAdminService /n Method : verifyIdToken /n Error : ", error);
      throw error;
    }
  }
}
