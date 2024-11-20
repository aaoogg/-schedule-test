import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CustomInputComponent } from '../components/custom-input/custom-input.component';
import { CustomButtonComponent } from '../components/custom-button/custom-button.component';
import { CustomIconComponent } from '../components/custom-icon/custom-icon.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    CustomInputComponent,
    CustomButtonComponent,
    CustomIconComponent,
  ]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (this.username && this.password) {
      const loginRequest = {
        username: this.username,
        password: this.password
      };

      this.authService.login(loginRequest).pipe(
        catchError(err => {
          console.error('Erro ao realizar login', err);
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          console.log('Login bem-sucedido:', response);
          const userSessionData = {
            accessToken: response.accessToken,
            id: response.id,
            tipos: response.tipos,
            tokenType: response.tokenType,
            username: response.username
          };
          localStorage.setItem('userSession', JSON.stringify(userSessionData));
          this.router.navigate(['/menu']);
        } else {
          console.error('Falha no login');
        }
      });

      this.username = '';
      this.password = '';
      this.rememberMe = false;
    } else {
      console.error('Por favor, preencha todos os campos.');
    }
  }
}
