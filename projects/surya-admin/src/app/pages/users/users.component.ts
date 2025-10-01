import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { UsersService, CognitoUser } from '../../services/users.service';
import { CreateUserModalComponent } from './create-user-modal/create-user-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  version = '0.2';
  users: CognitoUser[] = [];
  filteredUsers: CognitoUser[] = [];
  loading = false;
  error: string | null = null;
  searchTerm: string = '';
  renewingPassword: string | null = null;
  grantingAccess: string | null = null;

  constructor(
    private usersService: UsersService,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;
    
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error = 'Erro ao carregar usuários. Verifique sua conexão e tente novamente.';
        this.loading = false;
      }
    });
  }


  getUserStatusColor(status: string): string {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'UNCONFIRMED':
        return 'warning';
      case 'FORCE_CHANGE_PASSWORD':
        return 'tertiary';
      case 'STANDALONE':
        return 'medium';
      default:
        return 'medium';
    }
  }

  getUserTypeColor(userType: string): string {
    switch (userType) {
      case 'cognito':
        return 'primary';
      case 'typebot':
        return 'secondary';
      case 'manual':
        return 'tertiary';
      default:
        return 'medium';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  }

  onSearchInput(event: any) {
    const searchTerm = event.target.value.toLowerCase().trim();
    this.searchTerm = searchTerm;
    this.filterUsers();
  }

  private filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
      return;
    }

    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(this.searchTerm) ||
      user.email.toLowerCase().includes(this.searchTerm) ||
      user.username.toLowerCase().includes(this.searchTerm) ||
      user.user_id.toLowerCase().includes(this.searchTerm) ||
      (user.phone && user.phone.toLowerCase().includes(this.searchTerm)) ||
      user.user_type.toLowerCase().includes(this.searchTerm)
    );
  }

  async renewPassword(user: CognitoUser) {
    this.renewingPassword = user.user_id;
    
    try {
      const response = await this.usersService.renewPassword(user.user_id).toPromise();
      
      // Update user in local arrays
      const userIndex = this.users.findIndex(u => u.user_id === user.user_id);
      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.users[userIndex], expired: false };
        this.filterUsers(); // Refresh filtered list
      }
      
      // Show success message
      await this.showToast(response?.message || 'Senha renovada com sucesso', 'success');
      
    } catch (error: any) {
      console.error('Error renewing password:', error);
      const errorMessage = error?.error?.message || 'Erro ao renovar senha. Tente novamente.';
      await this.showToast(errorMessage, 'danger');
    } finally {
      this.renewingPassword = null;
    }
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

  async openCreateUserModal() {
    const modal = await this.modalController.create({
      component: CreateUserModalComponent,
      cssClass: 'create-user-modal',
      backdropDismiss: true,
      showBackdrop: true,
      presentingElement: document.querySelector('ion-app') || undefined
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'created' && result.data) {
        // Add new user to local arrays
        const newUser: CognitoUser = {
          user_id: result.data.user_id,
          username: result.data.email,
          email: result.data.email,
          name: result.data.name,
          phone: result.data.phone || '',
          user_type: result.data.app_user ? 'cognito' : 'manual',
          app_user: result.data.app_user,
          is_admin: false,
          status: result.data.status,
          expired: false,
          created_date: result.data.created_date,
          last_modified_date: result.data.created_date
        };

        this.users.unshift(newUser); // Add to beginning of list
        this.filterUsers(); // Refresh filtered list
      }
    });

    await modal.present();
  }

  async grantAppAccess(user: CognitoUser) {
    this.grantingAccess = user.user_id;
    
    try {
      const response = await this.usersService.grantAppAccess(user.user_id, true).toPromise();
      
      // Update user in local arrays
      const userIndex = this.users.findIndex(u => u.user_id === user.user_id);
      if (userIndex !== -1) {
        this.users[userIndex] = {
          ...this.users[userIndex],
          app_user: true,
          user_type: 'cognito',
          status: response?.user?.status || 'FORCE_CHANGE_PASSWORD',
          expired: false
        };
        this.filterUsers(); // Refresh filtered list
      }
      
      // Show success message
      await this.showToast(response?.message || 'Acesso ao aplicativo concedido com sucesso', 'success');
      
    } catch (error: any) {
      console.error('Error granting app access:', error);
      const errorMessage = error?.error?.error || error?.error?.message || 'Erro ao conceder acesso ao app. Tente novamente.';
      await this.showToast(errorMessage, 'danger');
    } finally {
      this.grantingAccess = null;
    }
  }
}
