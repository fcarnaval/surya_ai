import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService, ProfileUser } from '../../services/profile.service';
import { ProfileFlowService } from 'surya-lib/services/profile-flow.service';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss'
})
export class ProfileInfoComponent implements OnInit {
  version = '0.2';
  users: ProfileUser[] = [];
  filteredUsers: ProfileUser[] = [];
  loading = false;
  error: string | null = null;
  searchTerm: string = '';

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private profileFlowService: ProfileFlowService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.error = null;
    this.profileService.listProfileUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load profile users', err);
        this.error = 'Erro ao carregar usuários do perfil';
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'complete':
        return 'success';
      case 'partial':
        return 'warning';
      case 'empty':
        return 'medium';
      default:
        return 'tertiary';
    }
  }

  translateProfileStatus(status: string): string {
    switch (status) {
      case 'empty':
        return 'não iniciado';
      case 'partial':
        return 'parcial';
      case 'complete':
        return 'completo';
      default:
        return status;
    }
  }

  onSearchInput(event: any) {
    const term = (event?.target?.value || '').toLowerCase().trim();
    this.searchTerm = term;
    this.filterUsers();
  }

  private filterUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
      return;
    }

    this.filteredUsers = this.users.filter((user) =>
      (user.name || '').toLowerCase().includes(this.searchTerm) ||
      (user.email || '').toLowerCase().includes(this.searchTerm) ||
      (user.user_id || '').toLowerCase().includes(this.searchTerm) ||
      (user.profile_status || '').toLowerCase().includes(this.searchTerm)
    );
  }

  openProfileFlow(user: ProfileUser): void {
    this.profileFlowService.setUserId(user.user_id);
    this.router.navigate(['/personal-data']);
  }
}


