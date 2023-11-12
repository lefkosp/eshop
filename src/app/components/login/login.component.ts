import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public details = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      this.usernameValidator,
    ]),
    password: new FormControl('', [
      Validators.required,
      this.passwordValidator,
    ]),
  });

  public formSubmitted = false;

  constructor(private router: Router, private authService: AuthService) {}

  public usernameValidator(control: AbstractControl) {
    const value = control.value;

    if (value !== 'Admin') return { invalidUsername: true };

    return null;
  }

  public passwordValidator(control: AbstractControl) {
    const value = control.value;

    if (value !== '123456') return { invalidPassword: true };

    return null;
  }

  public login() {
    this.formSubmitted = true;

    if (this.details.invalid) return;

    this.authService.login();
    this.router.navigate(['/home']);
  }
}
