import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { UsersComponent } from './pages/users/users.component';
import { ProfileInfoComponent } from './pages/profile-info/profile-info.component';
import { PlanUsersComponent } from './pages/plan-users/plan-users.component';
import { ViewCompletePlanComponent } from './pages/view-complete-plan/view-complete-plan.component';
import { AdminAuthGuard } from 'surya-lib/auth/guards/admin-auth.guard';
import { LoginPage } from 'surya-lib/auth/pages/login/login.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'profile-info',
    component: ProfileInfoComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'plan-users',
    component: PlanUsersComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'view-complete-plan/:userId/:userName',
    component: ViewCompletePlanComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent
  },
  // Profile Flow Routes from surya-lib
  {
    path: 'personal-data',
    loadChildren: () => import('surya-lib/pages/personal-data/personal-data.module').then( m => m.PersonalDataPageModule),
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'physical-attributes',
    loadChildren: () => import('surya-lib/pages/physical-attributes/physical-attributes.module').then( m => m.PhysicalAttributesPageModule),
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'mind-setting',
    loadChildren: () => import('surya-lib/pages/mind-setting/mind-setting.module').then( m => m.MindSettingPageModule),
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'habbits',
    loadChildren: () => import('surya-lib/pages/habbits/habbits.module').then( m => m.HabbitsPageModule),
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'excrements',
    loadChildren: () => import('surya-lib/pages/excrements/excrements.module').then( m => m.ExcrementsPageModule),
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'medical-history',
    loadChildren: () => import('surya-lib/pages/medical-history/medical-history.module').then( m => m.MedicalHistoryPageModule),
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'goals',
    loadChildren: () => import('surya-lib/pages/goals/goals.module').then( m => m.GoalsPageModule),
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'tongue-capture',
    loadChildren: () => import('surya-lib/pages/tongue-capture/tongue-capture.module').then( m => m.TongueCapturePageModule),
    canActivate: [AdminAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
