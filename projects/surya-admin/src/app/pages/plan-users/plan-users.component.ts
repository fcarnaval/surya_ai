import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { PlanUsersService, PlanUser } from '../../services/plan-users.service';
import { PlanViewModalComponent } from './plan-view-modal/plan-view-modal.component';

@Component({
  selector: 'app-plan-users',
  templateUrl: './plan-users.component.html',
  styleUrl: './plan-users.component.scss'
})
export class PlanUsersComponent implements OnInit {
  version = '0.1';
  users: PlanUser[] = [];
  filteredUsers: PlanUser[] = [];
  loading = false;
  error: string | null = null;
  searchTerm: string = '';
  Object = Object; // For template access
  
  // Filter options
  planStatusFilter: string = 'all'; // 'all', 'has_plan', 'no_plan', 'plan_empty', 'processing'
  userTypeFilter: string = 'all'; // 'all', 'app_user', 'non_app_user'

  constructor(
    private planUsersService: PlanUsersService,
    private toastController: ToastController,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;
    
    this.planUsersService.getPlanUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading plan users:', error);
        this.error = 'Erro ao carregar usuários com planos. Verifique sua conexão e tente novamente.';
        this.loading = false;
      }
    });
  }

  getPlanStatusColor(planStatus: string): string {
    switch (planStatus) {
      case 'has_plan':
        return 'success';
      case 'plan_empty':
        return 'warning';
      case 'processing':
        return 'tertiary';
      case 'no_plan':
        return 'medium';
      default:
        return 'medium';
    }
  }

  getPlanStatusText(planStatus: string): string {
    switch (planStatus) {
      case 'has_plan':
        return 'Com Plano';
      case 'plan_empty':
        return 'Plano Vazio';
      case 'processing':
        return 'Processando';
      case 'no_plan':
        return 'Sem Plano';
      default:
        return 'Desconhecido';
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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  }

  onSearchInput(event: any) {
    const searchTerm = event.target.value.toLowerCase().trim();
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  onPlanStatusFilterChange(event: any) {
    this.planStatusFilter = event.detail.value;
    this.applyFilters();
  }

  onUserTypeFilterChange(event: any) {
    this.userTypeFilter = event.detail.value;
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = this.users;

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(this.searchTerm) ||
        user.email.toLowerCase().includes(this.searchTerm) ||
        user.username.toLowerCase().includes(this.searchTerm) ||
        user.user_id.toLowerCase().includes(this.searchTerm) ||
        (user.phone && user.phone.toLowerCase().includes(this.searchTerm)) ||
        user.user_type.toLowerCase().includes(this.searchTerm)
      );
    }

    // Apply plan status filter
    if (this.planStatusFilter !== 'all') {
      filtered = filtered.filter(user => user.plan_status === this.planStatusFilter);
    }

    // Apply user type filter
    if (this.userTypeFilter !== 'all') {
      if (this.userTypeFilter === 'app_user') {
        filtered = filtered.filter(user => user.app_user);
      } else if (this.userTypeFilter === 'non_app_user') {
        filtered = filtered.filter(user => !user.app_user);
      }
    }

    this.filteredUsers = filtered;
  }

  getFilterSummary(): string {
    const total = this.users.length;
    const filtered = this.filteredUsers.length;
    const withPlans = this.filteredUsers.filter(u => u.plan_status === 'has_plan').length;
    const withoutPlans = this.filteredUsers.filter(u => u.plan_status === 'no_plan').length;
    const emptyPlans = this.filteredUsers.filter(u => u.plan_status === 'plan_empty').length;
    const processing = this.filteredUsers.filter(u => u.plan_status === 'processing').length;
    
    return `${filtered}/${total} usuários • ${withPlans} com plano • ${emptyPlans} vazios • ${processing} processando • ${withoutPlans} sem plano`;
  }

  async viewPlan(user: PlanUser) {
    if (!user.has_plan || user.plan_status === 'no_plan') {
      await this.showToast('Este usuário não possui um plano para visualizar.', 'danger');
      return;
    }

    if (user.plan_status === 'processing') {
      await this.showToast('O plano ainda está sendo gerado. Tente novamente em alguns instantes.', 'danger');
      return;
    }

    const modal = await this.modalController.create({
      component: PlanViewModalComponent,
      componentProps: {
        userId: user.user_id,
        userName: user.name
      },
      cssClass: 'plan-view-modal',
      backdropDismiss: true,
      showBackdrop: true,
      presentingElement: document.querySelector('ion-app') || undefined
    });

    await modal.present();
  }

  async createSimplifiedPlan(user: PlanUser) {
    if (user.has_simplified_plan && user.simplified_plan_info?.status !== 'plan_empty') {
      await this.showToast('Este usuário já possui um plano simplificado.', 'danger');
      return;
    }

    try {
      this.loading = true;
      await this.planUsersService.createSimplifiedPlan(user.user_id, user.name).toPromise();
      await this.showToast(`Criação do plano simplificado iniciada para ${user.name}`, 'success');
      
      // Reload users to show updated status
      setTimeout(() => {
        this.loadUsers();
      }, 2000);
    } catch (error) {
      console.error('Error creating simplified plan:', error);
      await this.showToast('Erro ao criar plano simplificado. Tente novamente.', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async recreateSimplifiedPlan(user: PlanUser) {
    try {
      this.loading = true;
      await this.planUsersService.recreateSimplifiedPlan(user.user_id, user.name).toPromise();
      await this.showToast(`Recriação do plano simplificado iniciada para ${user.name}`, 'success');
      
      // Reload users to show updated status
      setTimeout(() => {
        this.loadUsers();
      }, 2000);
    } catch (error) {
      console.error('Error recreating simplified plan:', error);
      await this.showToast('Erro ao recriar plano simplificado. Tente novamente.', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async createCompletePlan(user: PlanUser) {
    if (user.has_complete_plan && user.complete_plan_info?.status === 'has_plan') {
      await this.showToast('Este usuário já possui um plano completo. Use "Recriar" para gerar novamente.', 'danger');
      return;
    }

    if (user.has_complete_plan && user.complete_plan_info?.status === 'processing') {
      await this.showToast('Um plano completo já está sendo gerado para este usuário.', 'danger');
      return;
    }

    try {
      this.loading = true;
      await this.planUsersService.createCompletePlan(user.user_id, user.name).toPromise();
      await this.showToast(`Criação do plano completo iniciada para ${user.name}`, 'success');
      
      // Reload users to show updated status
      setTimeout(() => {
        this.loadUsers();
      }, 2000);
    } catch (error) {
      console.error('Error creating complete plan:', error);
      await this.showToast('Erro ao criar plano completo. Tente novamente.', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async recreateCompletePlan(user: PlanUser) {
    try {
      this.loading = true;
      await this.planUsersService.recreateCompletePlan(user.user_id, user.name).toPromise();
      await this.showToast(`Recriação do plano completo iniciada para ${user.name}`, 'success');
      
      // Reload users to show updated status
      setTimeout(() => {
        this.loadUsers();
      }, 5000);
    } catch (error) {
      console.error('Error recreating complete plan:', error);
      await this.showToast('Erro ao recriar plano completo. Tente novamente.', 'danger');
    } finally {
      this.loading = false;
    }
  }

  getPlanTypeStatus(user: PlanUser, planType: 'simplified' | 'complete'): string {
    if (planType === 'simplified') {
      if (!user.has_simplified_plan) return 'Sem Plano';
      return user.simplified_plan_info?.status === 'processing' ? 'Processando' :
             user.simplified_plan_info?.status === 'has_plan' ? 'Com Plano' :
             user.simplified_plan_info?.status === 'plan_empty' ? 'Plano Vazio' : 'Desconhecido';
    } else {
      if (!user.has_complete_plan) return 'Sem Plano';
      return user.complete_plan_info?.status === 'processing' ? 'Processando' :
             user.complete_plan_info?.status === 'has_plan' ? 'Com Plano' :
             user.complete_plan_info?.status === 'plan_empty' ? 'Plano Vazio' : 'Desconhecido';
    }
  }

  getPlanTypeColor(user: PlanUser, planType: 'simplified' | 'complete'): string {
    const status = this.getPlanTypeStatus(user, planType);
    switch (status) {
      case 'Com Plano':
        return 'success';
      case 'Plano Vazio':
        return 'warning';
      case 'Processando':
        return 'tertiary';
      case 'Sem Plano':
        return 'medium';
      default:
        return 'medium';
    }
  }


  async viewCompletePlan(user: PlanUser) {
    if (!user.has_complete_plan || user.complete_plan_info?.status !== 'has_plan') {
      await this.showToast('Este usuário não possui um plano completo para visualizar.', 'danger');
      return;
    }

    // Navigate to the full-page view with userId and userName as route parameters
    const encodedUserName = encodeURIComponent(user.name);
    this.router.navigate(['/view-complete-plan', user.user_id, encodedUserName]);
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