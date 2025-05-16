import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideFirebaseApp(() => 
      initializeApp({ 
        projectId: "aramprojekt", 
        appId: "1:357292020604:web:4259903e4778f94089caf9", 
        storageBucket: "aramprojekt.firebasestorage.app", 
        apiKey: "AIzaSyDsiPO6WbBU33WUOPG1aLCYceQPywTp3lc", 
        authDomain: "aramprojekt.firebaseapp.com", 
        messagingSenderId: "357292020604" 
      })), 
      provideAuth(() => 
        getAuth()), 
      provideFirestore(() => 
        getFirestore())]
};
