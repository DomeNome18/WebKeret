import { Component } from '@angular/core';
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

  constructor(private fb: FormBuilder) {
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
      const newReading: Electricity = this.readingForm.value;

      console.log('New reading:', newReading);
    }
  }
}
