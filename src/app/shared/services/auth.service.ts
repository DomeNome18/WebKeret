import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser, UserCredential } from '@angular/fire/auth';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Observable<FirebaseUser | null>;

  constructor(private auth: Auth, private router: Router, private firestore: Firestore) {
    this.currentUser = authState(this.auth);
  }

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signOut(): Promise<void> {
    localStorage.setItem('loggedIn', 'false');

    return signOut(this.auth).then(() => {
      this.router.navigateByUrl('/home');
    })
  }

  isLoggedIn(): Observable<FirebaseUser | null> {
    return this.currentUser;
  }

  updateLoginStatus(isLoggedIn: boolean): void {
    localStorage.setItem('loggedIn', isLoggedIn ? 'true' : 'false');
  }

  async signUp(email: string, password: string, data: Partial<User>): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      await this.createUserData(userCredential.user.uid, {
        ...data,
        id: userCredential.user.uid,
        email: email,
        readings: [],
      });

      return userCredential;
    } catch (error) {
      console.log("Hiba regisztrációnál: ", error);
      throw error;
    }
  }

  private async createUserData(id: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(collection(this.firestore, 'Users'), id);
    
    return setDoc(userRef, userData);
  }
}
