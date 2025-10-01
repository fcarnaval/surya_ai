import { Component, Input, OnInit } from '@angular/core';
import { PlanService, CompletePlanResponse, CompletePlanItem, UserProfileStatus, PlanGenerationJobStatus } from '../../services/plan.service';

@Component({
  selector: 'lib-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {
  @Input() userId?: string; // If provided, will load plan for specific user (admin mode)
  @Input() showHeader = true; // Whether to show the header
  @Input() showFooter = false; // Whether to show the footer
  
  planData: CompletePlanResponse | null = null;
  loading = true;
  error: string | null = null;
  noPlan = false; // True when 404 - no plan exists
  generating = false; // True when plan generation is in progress
  generatingMessage = '';
  
  // Profile status properties
  profileStatus: UserProfileStatus | null = null;
  showProfileIncomplete = false; // True when profile is empty or partial
  profileMessage = '';
  
  // Tab management
  selectedTab: string = '';
  availableTabs: string[] = [];

  constructor(private planService: PlanService) { }

  ngOnInit() {
    this.loadPlan();
  }

  loadPlan() {
    this.loading = true;
    this.error = null;
    this.noPlan = false;
    this.generating = false;
    this.showProfileIncomplete = false;
    
    const planRequest = this.userId 
      ? this.planService.getCompletePlanForUser(this.userId)
      : this.planService.getCompletePlan();
    
    planRequest.subscribe({
      next: (data) => {
        this.planData = data;
        this.loading = false;
        this.setupTabs();
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao carregar plano:', err);
        
        // Check if it's a 404 (no plan found)
        if (err.status === 404) {
          this.noPlan = true;
          this.checkPlanGenerationAndProfileStatus();
        } else {
          // Other errors (500, network, etc.)
          this.error = 'Erro ao carregar o plano. Tente novamente.';
        }
      }
    });
  }

  checkPlanGenerationAndProfileStatus() {
    // Check both plan generation status and profile status
    const planStatusRequest = this.userId
      ? this.planService.checkPlanGenerationStatusForUser(this.userId)
      : this.planService.checkPlanGenerationStatus();

    const profileStatusRequest = this.userId
      ? this.planService.checkUserProfileForUser(this.userId)
      : this.planService.checkUserProfile();

    // Check plan generation status
    planStatusRequest.subscribe({
      next: (planStatus) => {
        if (planStatus.status === 'generating' || planStatus.status === 'processing') {
          this.generating = true;
          this.generatingMessage = planStatus.message || 'Plano sendo gerado...';
          this.noPlan = false;
        }
      },
      error: (err) => {
        console.error('Erro ao verificar status de geração do plano:', err);
      }
    });

    // Check profile status
    profileStatusRequest.subscribe({
      next: (profileStatus) => {
        this.profileStatus = profileStatus;
        
        if (profileStatus.profile_status === 'empty') {
          this.showProfileIncomplete = true;
          this.profileMessage = 'Complete seu perfil para criar um plano personalizado.';
        } else if (profileStatus.profile_status === 'partial') {
          this.showProfileIncomplete = true;
          this.profileMessage = `Seu perfil está ${profileStatus.completion_percentage}% completo. Complete todas as informações para obter melhores resultados.`;
        }
      },
      error: (err) => {
        console.error('Erro ao verificar status do perfil:', err);
      }
    });
  }

  retry() {
    this.loadPlan();
  }

  createPlan() {
    // Only allow plan creation if profile is complete or user explicitly wants to proceed
    if (this.profileStatus?.profile_status === 'empty') {
      // Don't allow plan creation with empty profile
      return;
    }

    this.generating = true;
    this.generatingMessage = 'Iniciando geração do plano...';
    this.noPlan = false;
    this.error = null;
    this.showProfileIncomplete = false;

    // For admin users accessing other user's plans, we have userId
    // For regular users, we don't have userId but the backend will use their authenticated token
    const userName = this.planData?.user_name || 'Usuário';
    const planRequest = this.userId
      ? this.planService.generateCompletePlanForUser(this.userId, userName)
      : this.planService.generateCompletePlan(userName);

    planRequest.subscribe({
      next: (response) => {
        console.log('Plan generation started:', response);
        this.generatingMessage = 'Plano sendo gerado... Aguarde alguns momentos.';
        
        // Start polling for completion (simplified approach)
        this.startPollingForPlanCompletion();
      },
      error: (err) => {
        console.error('Error starting plan generation:', err);
        this.generating = false;
        this.error = 'Erro ao iniciar geração do plano. Tente novamente.';
      }
    });
  }

  private startPollingForPlanCompletion() {
    // Poll every 10 seconds to check if plan is ready using both status check and plan fetch
    const interval = setInterval(() => {
      // First check the status
      const statusRequest = this.userId
        ? this.planService.checkPlanGenerationStatusForUser(this.userId)
        : this.planService.checkPlanGenerationStatus();

      statusRequest.subscribe({
        next: (status) => {
          if (status.status === 'has_plan') {
            // Plan is ready, try to fetch it
            const planRequest = this.userId 
              ? this.planService.getCompletePlanForUser(this.userId)
              : this.planService.getCompletePlan();
            
            planRequest.subscribe({
              next: (data) => {
                clearInterval(interval);
                this.planData = data;
                this.generating = false;
                this.generatingMessage = '';
                this.setupTabs();
              },
              error: (err) => {
                // Plan should be ready according to status, but fetch failed
                if (err.status === 404) {
                  // Status was wrong, continue polling
                  return;
                } else {
                  clearInterval(interval);
                  this.generating = false;
                  this.error = 'Erro ao carregar plano gerado.';
                }
              }
            });
          } else if (status.status === 'generating' || status.status === 'processing') {
            // Update the message with current status
            this.generatingMessage = status.message || 'Plano sendo gerado...';
          } else {
            // Unexpected status
            clearInterval(interval);
            this.generating = false;
            this.error = 'Status inesperado durante geração do plano.';
          }
        },
        error: (err) => {
          // Error checking status, fall back to direct plan checking
          const planRequest = this.userId 
            ? this.planService.getCompletePlanForUser(this.userId)
            : this.planService.getCompletePlan();
          
          planRequest.subscribe({
            next: (data) => {
              clearInterval(interval);
              this.planData = data;
              this.generating = false;
              this.generatingMessage = '';
              this.setupTabs();
            },
            error: (planErr) => {
              if (planErr.status !== 404) {
                clearInterval(interval);
                this.generating = false;
                this.error = 'Erro durante a geração do plano.';
              }
              // If 404, continue polling
            }
          });
        }
      });
    }, 10000); // Poll every 10 seconds

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(interval);
      if (this.generating) {
        this.generating = false;
        this.generatingMessage = '';
        this.error = 'Tempo limite para geração do plano excedido. Atualize a página.';
      }
    }, 300000); // 5 minutes
  }

  goToProfileData() {
    // Navigate to profile data flow
    if (typeof window !== 'undefined') {
      window.location.href = '/persona-data';
    }
  }

  proceedWithPartialProfile() {
    // Allow plan creation even with partial profile
    if (this.profileStatus?.profile_status === 'partial') {
      this.showProfileIncomplete = false;
      this.createPlan();
    }
  }

  setupTabs() {
    if (this.planData?.plan_data) {
      const allTabs = Object.keys(this.planData.plan_data);
      
      // Sort tabs to put 'report' (Resumo) first, then rest in original order
      this.availableTabs = [];
      
      // Add 'report' first if it exists
      if (allTabs.includes('report')) {
        this.availableTabs.push('report');
      }
      
      // Add remaining tabs in their original order
      allTabs.forEach(tab => {
        if (tab !== 'report') {
          this.availableTabs.push(tab);
        }
      });
      
      // Set the first tab as selected by default
      if (this.availableTabs.length > 0 && !this.selectedTab) {
        this.selectedTab = this.availableTabs[0];
      }
    }
  }

  onTabChange(event: any) {
    this.selectedTab = event.detail.value;
  }

  // Helper methods to extract data from nested structure
  getPlanKeys(): string[] {
    if (!this.planData?.plan_data) return [];
    return Object.keys(this.planData.plan_data);
  }

  getPlanItem(key: string) {
    return this.planData?.plan_data[key as keyof typeof this.planData.plan_data];
  }

  formatPlanType(key: string): string {
    const translations: { [key: string]: string } = {
      'report': 'Resumo',
      'sleep': 'Sono',
      'mind': 'Mente',
      'treatment': 'Tratamento',
      'routine': 'Rotina',
      'diet': 'Alimentação',
      'movement': 'Movimento'
    };
    return translations[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }

  getIconForPlanType(key: string): string {
    const icons: { [key: string]: string } = {
      'sleep': 'bed-outline',
      'mind': 'happy-outline',
      'treatment': 'medical-outline',
      'routine': 'time-outline',
      'report': 'document-text-outline',
      'diet': 'restaurant-outline',
      'movement': 'fitness-outline'
    };
    return icons[key] || 'document-outline';
  }

  // Flatten nested objects for display
  flattenObject(obj: any, prefix: string = ''): Array<{key: string, value: any}> {
    const items: Array<{key: string, value: any}> = [];
    
    if (!obj || typeof obj !== 'object') {
      return [{key: prefix, value: obj}];
    }

    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          // Array of objects
          value.forEach((item, index) => {
            items.push(...this.flattenObject(item, `${newKey}[${index}]`));
          });
        } else {
          // Array of primitives
          items.push({key: newKey, value: value});
        }
      } else if (value && typeof value === 'object') {
        items.push(...this.flattenObject(value, newKey));
      } else {
        items.push({key: newKey, value: value});
      }
    }
    
    return items;
  }

  // Format key names for display
  formatKey(key: string): string {
    // Remove plan type prefixes (e.g., "plano_sono.", "plano_mente.")
    let formattedKey = key.replace(/^plano_[^.]+\./, '');
    
    // If the key has multiple levels, remove the first level (section name)
    // since it's already shown as the section header
    const keyParts = formattedKey.split('.');
    if (keyParts.length > 1) {
      formattedKey = keyParts.slice(1).join('.');
    }
    
    return formattedKey
      .replace(/[_\[\]]/g, ' ')
      .replace(/\./g, ' > ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  // Check if value should be displayed (filter out metadata)
  shouldDisplayKey(key: string): boolean {
    const hiddenKeys = ['metadata', 'user_id', 'plan_id', 'status', 'created_at', 'updated_at', 'plan_type', 'content_key'];
    return !hiddenKeys.some(hidden => key.toLowerCase().includes(hidden.toLowerCase()));
  }

  // Helper methods for template
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  isStringArray(value: any[]): boolean {
    return value.length > 0 && typeof value[0] === 'string';
  }

  // Safe accessors for template
  getPlanItemSafe(key: string): CompletePlanItem | null {
    return this.getPlanItem(key) || null;
  }

  // Group plan items by their top-level section
  groupPlanItemsBySection(planData: any): Array<{sectionName: string, items: Array<{key: string, value: any}>}> {
    const flattenedItems = this.flattenObject(planData);
    const sections: { [key: string]: Array<{key: string, value: any}> } = {};
    
    for (const item of flattenedItems) {
      if (!this.shouldDisplayKey(item.key)) continue;
      
      // Remove plan type prefix and get the top-level section
      const keyWithoutPlanType = item.key.replace(/^plano_[^.]+\./, '');
      const sectionKey = keyWithoutPlanType.split('.')[0];
      const sectionName = this.formatSectionName(sectionKey);
      
      if (!sections[sectionName]) {
        sections[sectionName] = [];
      }
      
      sections[sectionName].push({
        key: keyWithoutPlanType,
        value: item.value
      });
    }
    
    // Convert to array format for template
    return Object.keys(sections).map(sectionName => ({
      sectionName,
      items: sections[sectionName]
    }));
  }

  // Format section names for display
  formatSectionName(sectionKey: string): string {
    return sectionKey
      .replace(/[_]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}