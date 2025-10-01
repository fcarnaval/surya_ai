import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrl: './create-user-modal.component.scss'
})
export class CreateUserModalComponent implements OnInit {
  createUserForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private toastController: ToastController,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.createUserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: [''],
      appUser: [true],
      forcePasswordChange: [false]
    });
  }

  async onSubmit() {
    if (this.createUserForm.valid) {
      this.isSubmitting = true;
      
      try {
        const { email, name, phone, appUser, forcePasswordChange } = this.createUserForm.value;
        const response = await this.usersService.createUser(email, name, phone, appUser, forcePasswordChange).toPromise();
        
        // Show success message
        await this.showToast(response?.message || 'Usuário criado com sucesso', 'success');
        
        // Close modal and return created user
        await this.modalController.dismiss(response?.user, 'created');
        
      } catch (error: any) {
        console.error('Error creating user:', error);
        const errorMessage = error?.error?.error || error?.error?.message || 'Erro ao criar usuário. Tente novamente.';
        await this.showToast(errorMessage, 'danger');
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  async cancel() {
    await this.modalController.dismiss(null, 'cancel');
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color,
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}
