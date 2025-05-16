import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { AddReadingComponent } from './pages/add-reading/add-reading.component';
import { ReadingsComponent } from './pages/readings/readings.component';
import { authGuard, publicGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [publicGuard] },
    { path: 'home', component: HomeComponent },
    { path: 'add-reading', component: AddReadingComponent, canActivate: [authGuard] },
    { path: 'readings', component: ReadingsComponent, canActivate: [authGuard]},

    { path: '', component: HomeComponent},
    { path: '**', component: NotFoundComponent}
];
