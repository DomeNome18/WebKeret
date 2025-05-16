import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Electricity } from '../../shared/models/Electricity';
import { ReadingsItemComponent } from "./readings-item/readings-item.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, firstValueFrom, Subscription, take } from 'rxjs';
import { ReadingService } from '../../shared/services/reading.service';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-readings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ReadingsItemComponent
  ],
  templateUrl: './readings.component.html',
  styleUrl: './readings.component.scss'
})

export class ReadingsComponent implements OnInit, OnDestroy {
  private _snackBar = inject(MatSnackBar);

  readings: Electricity[] = [];
  matchingAddress: Electricity[] = [];
  highUse: Electricity[] = [];
  recent: Electricity[] = [];
  special: Electricity[] = [];

  userName: string = "";

  private subscriptions: Subscription[] = [];

  constructor(private readingService: ReadingService, private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadAllData();

    const usernameSub = this.userService.getUserName().subscribe(name => {
      this.userName = name;
    });

    this.subscriptions.push(usernameSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  loadAllData(): void {

    const allReadings$ = this.readingService.getAllReadings();

    //Complex
    const matchingAddress$ = this.readingService.getMatchingAddress();
    const highUse$ = this.readingService.getOver4k();
    const recent$ = this.readingService.getRecent();
    const special$ = this.readingService.getSpecial();

    const combined$ = combineLatest([
      allReadings$,
      matchingAddress$,
      highUse$,
      recent$,
      special$
    ]);

    const subscription = combined$.subscribe({
      next: ([allReadings, matchingAddress, highUse, recent, special]) => {
        this.readings = allReadings;
        this.matchingAddress = matchingAddress;
        this.highUse = highUse;
        this.recent = recent;
        this.special = special;
      },
      error: (error) => {
        console.error('Hiba betöltésnél: ', error);
      }
    });

    this.subscriptions.push(subscription);
  }

  /*readings: Electricity[] = [
    { id: '1', address: 'Példa utca 9', state: 4500, date: new Date(2024, 8, 6)},
    { id: '2', address: 'Példa tér 1', state: 3200, date: new Date(2025, 2, 3)},
    { id: '3', address: 'Példa körút 1572', state: 5100, date: new Date(2026, 11, 28)}
  ];*/

  onDeleteReading(id: string | undefined): void {
    if (!id) return;

    if (confirm("Biztos törölni akarod?")) {
      this.readingService.deleteReading(id)
        .then(() => {
          this.loadAllData();

          this._snackBar.open('Mérőóra állás sikeresen  törölve lett!', 'OK', {
            duration: 950,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        })
        .catch(error => {
          console.error('Hiba törlésnél: ', error);
          this._snackBar.open(error, 'OK', {
            duration: 950,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        })
    }
  }
}
