import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../shared/models/User';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  private _snackBar = inject(MatSnackBar);
  regError: string = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      //const newUser: User = this.registerForm.value;
      //console.log('New user: ', newUser)

      const userData: Partial<User> = {
        email: this.registerForm.value.email,
        name: this.registerForm.value.name,
        address: this.registerForm.value.address,
        readings: [],
      };

      this.authService.signUp(this.registerForm.value.email, this.registerForm.value.password, userData)
        .then(userCredential => {
          console.log('Sikeres regisztráció: ', userCredential.user);
          this.authService.updateLoginStatus(true);
          
          this._snackBar.open('A regisztráció sikeres!', 'OK', {
            duration: 950,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          this.router.navigateByUrl('/home');
        })
        .catch(error => {
          console.log('Hiba a regisztrációnál: ', error);

          switch(error.code) {
            case 'auth/email-already-in-use':
              this.regError = 'Ez az email már használban van!';
              break;
            case 'auth/invalid-email':
              this.regError = 'Nem megfelelő email.';
              break;
            case 'auth/weak-password':
              this.regError = 'A jelszó túl gyenge, használj 6 karaktert!';
              break;
            default:
              this.regError = 'Ismeretlen hiba, próbáld újra!';
          }

          this._snackBar.open(this.regError, 'OK', {
            duration: 950,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        })
    }
  }
}
