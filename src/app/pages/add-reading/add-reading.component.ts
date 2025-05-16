import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Electricity } from '../../shared/models/Electricity';
import { ReadingService } from '../../shared/services/reading.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-reading',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './add-reading.component.html',
  styleUrl: './add-reading.component.scss'
})

export class AddReadingComponent {
  readingForm: FormGroup;
  private _snackBar = inject(MatSnackBar);


  constructor(private fb: FormBuilder, private readingService: ReadingService) {
    this.readingForm = this.fb.group({
      address: ['', [Validators.required]],
      state: ['', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^[0-9]+$/)
      ]],
      date: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.readingForm.valid) {
      const newReading: Omit<Electricity, 'id'> = {
        address: this.readingForm.value.address,
        state: this.readingForm.value.state,
        date: this.readingForm.value.date
      };

      this.readingService.addReading(newReading)
        .then(() => {
          console.log('New reading:', newReading);

          this._snackBar.open('Mérőóra állás sikeresen hozzá lett adva!', 'OK', {
            duration: 950,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        })
        .catch(error => {
          console.error('Hiba: ', error);
          
          this._snackBar.open(error, 'OK', {
            duration: 950,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        })
    }
  }
}
