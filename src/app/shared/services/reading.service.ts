import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, query, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { firstValueFrom, from, map, Observable, of, switchMap, take } from 'rxjs';
import { Electricity } from '../models/Electricity';
import { User } from '../models/User';
import { orderBy, QuerySnapshot, Timestamp, where } from 'firebase/firestore';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ReadingService {

  constructor(private firestore: Firestore, private authService: AuthService, private userService: UserService) { }

  //CREATE
  async addReading(reading: Omit<Electricity, 'id'>): Promise<Electricity> {
    try {
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));

      if (!user) {
        throw new Error('Nincsen bejelentkezett felhasználó');
      }

      const readingsCollection = collection(this.firestore, 'Readings');

      const docRef = await addDoc(readingsCollection, {...reading, date: Timestamp.fromDate(reading.date)});
      const readingId = docRef.id;

      await updateDoc(docRef, {id: readingId});

      const newReading = {
        ...reading,
        id: readingId
      } as Electricity;

      const userDocRef = doc(this.firestore, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const readings = userData.readings || [];

        readings.push(readingId);

        await updateDoc(userDocRef, {readings});
      }

      return newReading;
    } catch (error) {
      console.error('Hiba C műveletnél: ', error);
      throw error;
    }
  }

  //READ
  getAllReadings(): Observable<Electricity[]> {
    return this.authService.currentUser.pipe(
      switchMap(async user => {
        if(!user) {
          return of([]);
        }
        try {
          const UserDocRef = doc(this.firestore, 'Users', user.uid);
          const userDoc = await getDoc(UserDocRef);

          if (!userDoc.exists()) {
            return of([]);
          }

          const userData = userDoc.data() as User;
          const readingIDs = userData.readings || [];

          if (readingIDs.length === 0) {
            return of([]);
          }

          const readingsCollection = collection(this.firestore, 'Readings');
          const readings: Electricity[] = [];
          const batchSize = 10;

          for (let i = 0; i < readingIDs.length; i += batchSize) {
            const batch = readingIDs.splice(i, i + batchSize);
            const q = query(readingsCollection, where('__name__', 'in', batch));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(doc => {
              readings.push({...doc.data(), id: doc.id, date: doc.data()['date']?.toDate()} as Electricity);
            });
          }

          return of(readings);
        } catch (error) {
          console.error('Hiba R műveletnél: ', error);
          return of([]);
        }
      }),
      switchMap(readings => readings)
    );
  }

  //DELETE
  async deleteReading(readingId: string): Promise<void> {
    try {
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      if (!user) {
        throw new Error('Nincsen bejelentkezett felhasználó');
      }

      const userDocRef = doc(this.firestore, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('Nincs ilyen felhasználó');
      }
      
      const userData = userDoc.data() as User;
      
      if (!userData.readings || !userData.readings.includes(readingId)) {
        throw new Error('Ez az állás nem tartozik a megadott felhasználóhoz!');
      }

      const readingDocRef = doc(this.firestore, 'Readings', readingId);
      await deleteDoc(readingDocRef);

      const updatedReadings = userData.readings.filter(id => id !== readingId);
      
      return updateDoc(userDocRef, { readings: updatedReadings });
    } catch (error) {
      console.error('Hiba D műveletnél', error);
      throw error;
    }
  }

  //Get by matching address
  getMatchingAddress(): Observable<Electricity[]> {
    return this.authService.currentUser.pipe(
      switchMap(async user => {
        if (!user) return [];

        const address = await this.userService.getUserAddress(user.uid);
        const readingIDs = await this.userService.getUserReadingIDs(user.uid);

        if (readingIDs.length === 0 || !address) return [];

        const readingsCollection = collection(this.firestore, 'Readings');
        const q = query(readingsCollection, where('address', '==', address), orderBy('date', 'desc'));

        const snapshot = await getDocs(q);
        const readings: Electricity[] = [];

        snapshot.forEach(doc => {
          if (readingIDs.includes(doc.id)) {
            readings.push({ ...doc.data(), id: doc.id, date: doc.data()['date']?.toDate() } as Electricity);
          }
        });

        return readings;
      }),
      switchMap(result => of(result))
    );
  }

  //Get by high usage
  getOver4k(): Observable<Electricity[]> {
    return this.authService.currentUser.pipe(
      switchMap(async user => {
        if (!user) return [];

        const address = await this.userService.getUserAddress(user.uid);
        const readingIDs = await this.userService.getUserReadingIDs(user.uid);

        if (readingIDs.length === 0 || !address) return [];

        const readingsCollection = collection(this.firestore, 'Readings');
        const q = query(readingsCollection, where('state', '>=', 4000), orderBy('state', 'desc'));

        const snapshot = await getDocs(q);
        const readings: Electricity[] = [];

        snapshot.forEach(doc => {
          if (readingIDs.includes(doc.id)) {
            readings.push({ ...doc.data(), id: doc.id, date: doc.data()['date']?.toDate() } as Electricity);
          }
        });

        return readings;
      }),
      switchMap(result => of(result))
    );
  }

  //Get >= 2025
  getRecent(): Observable<Electricity[]> {
    return this.authService.currentUser.pipe(
      switchMap(async user => {
        if (!user) return [];

        const address = await this.userService.getUserAddress(user.uid);
        const readingIDs = await this.userService.getUserReadingIDs(user.uid);

        if (readingIDs.length === 0 || !address) return [];

        const readingsCollection = collection(this.firestore, 'Readings');
        const q = query(readingsCollection, where('date', '>=', new Date(2025,1,1)), orderBy('date', 'asc'));

        const snapshot = await getDocs(q);
        const readings: Electricity[] = [];

        snapshot.forEach(doc => {
          if (readingIDs.includes(doc.id)) {
            readings.push({ ...doc.data(), id: doc.id, date: doc.data()['date']?.toDate() } as Electricity);
          }
        });

        return readings;
      }),
      switchMap(result => of(result))
    );
  }

  //Get special
  getSpecial(): Observable<Electricity[]> {
    return this.authService.currentUser.pipe(
      switchMap(async user => {
        if (!user) return [];

        const address = await this.userService.getUserAddress(user.uid);
        const readingIDs = await this.userService.getUserReadingIDs(user.uid);

        if (readingIDs.length === 0 || !address) return [];

        const readingsCollection = collection(this.firestore, 'Readings');
        const q = query(readingsCollection, where('date', '>=', new Date(2020,1,1)), where('date', '<', new Date(2024,1,1)), where('state', '>=', 1000), where('state', '<=', 2500));

        const snapshot = await getDocs(q);
        const readings: Electricity[] = [];

        snapshot.forEach(doc => {
          if (readingIDs.includes(doc.id)) {
            readings.push({ ...doc.data(), id: doc.id, date: doc.data()['date']?.toDate() } as Electricity);
          }
        });

        return readings;
      }),
      switchMap(result => of(result))
    );
  }
}
