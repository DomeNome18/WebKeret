import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Electricity } from '../../shared/models/Electricity';
import { ReadingsItemComponent } from "./readings-item/readings-item.component";
import { MatSnackBar } from '@angular/material/snack-bar';

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

export class ReadingsComponent {
  private _snackBar = inject(MatSnackBar);

  readings: Electricity[] = [
    { id: '1', address: 'Példa utca 9', state: 4500, date: new Date(2024, 8, 6), userId: '3' },
    { id: '2', address: 'Példa tér 1', state: 3200, date: new Date(2025, 2, 3), userId: '6' },
    { id: '3', address: 'Példa körút 1572', state: 5100, date: new Date(2026, 11, 28), userId: '87' }
  ];

  onDeleteReading(id: string | undefined): void {
    if (!id) return;

    this.readings = this.readings.filter(reading => reading.id !== id);

    this._snackBar.open('Mérőóra állás sikeresen  törölve lett!', 'OK', {
      duration: 950,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });

    console.log(`Deleted reading with id: ${id}`);
  }
}
