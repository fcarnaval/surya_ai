import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage {
  newPasswordForm: FormGroup;
  password: string = '';
  errorMessage: string = '';

  requirements = {
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.newPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required]]
    });
  }

  checkPassword(value: string | null | undefined) {
    const password = value || '';

    this.password = password;
    this.requirements.length = password.length >= 8;
    this.requirements.upper = /[A-Z]/.test(password);
    this.requirements.lower = /[a-z]/.test(password);
    this.requirements.number = /\d/.test(password);
    this.requirements.special = /[\W_]/.test(password);

    this.newPasswordForm.get('newPassword')?.setValue(password);
  }

  isPasswordValid(): boolean {
    return Object.values(this.requirements).every(v => v);
  }

  submitNewPassword() {
    const newPassword = this.newPasswordForm.value.newPassword;

    this.authService.completeNewPassword(newPassword).then(() => {
      console.log('✅ Senha atualizada com sucesso.');
      this.router.navigate(['/home']);
    }).catch(err => {
      console.error('❌ Erro ao atualizar a senha:', err);
      this.errorMessage = err.message || 'Erro ao atualizar a senha.';
    });
  }
}
