import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

type ServiceAccountLike = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
  [key: string]: any;
};

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  onModuleInit() {
    if (admin.apps.length) return;

    // Try to load a full service account JSON from FIREBASE_SERVICE_ACCOUNT
    let serviceAccount: ServiceAccountLike | undefined;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } catch (err) {
        console.warn('⚠️  FIREBASE_SERVICE_ACCOUNT is set but is not valid JSON.');
      }
    }

    // Fallback to individual env vars
    if (!serviceAccount) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined;

      if (projectId || clientEmail || privateKey) {
        serviceAccount = {
          project_id: projectId,
          client_email: clientEmail,
          private_key: privateKey,
        };
      }
    }

    const hasRequiredFields = !!(
      serviceAccount &&
      typeof serviceAccount.project_id === 'string' &&
      typeof serviceAccount.client_email === 'string' &&
      typeof serviceAccount.private_key === 'string'
    );

    if (!hasRequiredFields) {
      // In non-production environments, don't fail the entire app — allow other routes to work.
      const env = process.env.NODE_ENV || 'development';
      const msg = 'Firebase Admin not initialized: missing service account (project_id, client_email, private_key).';
      if (env === 'production') {
        // In production we should fail fast so the issue is discovered.
        throw new Error(msg);
      }

      console.warn('⚠️  ' + msg + ' Set FIREBASE_SERVICE_ACCOUNT or the individual FIREBASE_* env vars to enable Firebase features.');
      return;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: serviceAccount?.project_id,
        clientEmail: serviceAccount?.client_email,
        privateKey: serviceAccount?.private_key,
      } as admin.ServiceAccount),
    });

    console.log('✅ Firebase Admin initialized successfully');
  }

  async verifyIdToken(idToken: string) {
    try {
      return admin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.log('Service : FirebaseAdminService /n Method : verifyIdToken /n Error : ', error);
      throw error;
    }
  }
}
