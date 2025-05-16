import { Injectable } from '@angular/core';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore, private authService: AuthService) { }


  //Reading IDs
  public async getUserReadingIDs(userId: string): Promise<string[]> {
    const userDocRef = doc(this.firestore, 'Users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return [];
    }
    
    const userData = userDoc.data() as User;
    return userData.readings || [];
  }

  //Address
  public async getUserAddress(userId: string): Promise<string> {
    const userDocRef = doc(this.firestore, 'Users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return '';
    }
    
    const userData = userDoc.data() as User;
    return userData.address || '';
  }

  //Name
  getUserName(): Observable<string> {
    return this.authService.currentUser.pipe(
      switchMap(user => {
        if (!user) return of('');

        const docRef = doc(this.firestore, 'Users', user.uid);
        
        return from(getDoc(docRef)).pipe(
          map(docSnap => docSnap.exists() ? docSnap.data()?.['name'] || '' : '')
        );
      })
    );
  }
}
