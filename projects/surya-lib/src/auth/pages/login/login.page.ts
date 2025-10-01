import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController
  ) {
      console.log("login component");
      this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
  const { email, password } = this.loginForm.value;

  this.authService.signIn(email, password).then(result => {
      if (result.challenge === 'NEW_PASSWORD_REQUIRED') {
      // Redireciona para uma nova tela ou exibe um campo de nova senha
      this.router.navigate(['/new-password'], { state: { email } });
      } else {
      console.log("✅ Login bem-sucedido:", result);
      localStorage.setItem('idToken', result.idToken);
      // this.router.navigate(['/home']);
      this.navCtrl.navigateRoot('/home');
      }
  }).catch(err => {
      console.error("❌ Erro no login:", err);
      
      if (err.code === 'NotAuthorizedException') {
        if (err.message.includes('Temporary password has expired')) {
          this.errorMessage = 'Sua senha temporária expirou. Solicite uma nova senha ao administrador.';
        } else if (err.message.includes('Incorrect username or password')) {
          this.errorMessage = 'Usuário ou senha incorretos.';
        } else {
          this.errorMessage = 'Não autorizado. Verifique suas credenciais.';
        }
      } else if (err.code === 'UserNotFoundException') {
        this.errorMessage = 'Usuário não encontrado.';
      } else if (err.code === 'UserNotConfirmedException') {
        this.errorMessage = 'Usuário não confirmado. Verifique seu e-mail.';
      } else {
        this.errorMessage = err.message || 'Erro ao fazer login.';
      }
    });
  }

}
