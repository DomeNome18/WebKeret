import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  hidePassword = true;
  loginError: string = '';
  private _snackBar = inject(MatSnackBar);
  authSubscription?: Subscription;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password)
        .then(userCredential => {
          console.log('Sikeres bejelentkezés: ', userCredential.user);
          this._snackBar.open('Sikeres bejelentkezés!', 'OK', {
            duration: 950,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.authService.updateLoginStatus(true);
          this.router.navigateByUrl('/home');
        })
        .catch(error => {
          console.log('Hiba a bejelentkezésnél: ', error);
          
          switch(error.code) {
            case 'auth/user-not-found':
              this.loginError = 'Nincs ilyen fiók!';
              break;
            case 'auth/wrong-password':
              this.loginError = 'Rossz jelszó!';
              break;
            case 'auth/invalid-credential':
              this.loginError = 'Rossz email vagy jelszó!';
              break;
            default:
              this.loginError = 'Ismeretlen hiba, próbáld újra!';
          }

          this._snackBar.open(this.loginError, 'OK', {
            duration: 950,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
