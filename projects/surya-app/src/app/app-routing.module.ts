import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthGuard } from 'surya-lib/auth/guards/user-auth.guard';
import { LoginPage } from 'surya-lib/auth/pages/login/login.page';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [UserAuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./pages/start/start.module').then( m => m.StartPageModule),
    pathMatch: 'full',
  },
  {
    path: 'conversation',
    loadChildren: () => import('./pages/conversation/conversation.module').then( m => m.ConversationPageModule),
    canActivate: [UserAuthGuard]
  },
  {
    path: 'tongue-capture',
    loadChildren: () => import('surya-lib/pages/tongue-capture/tongue-capture.module').then( m => m.TongueCapturePageModule),
    canActivate: [UserAuthGuard]
  },
  {
    path: 'personal-data',
    loadChildren: () => import('surya-lib/pages/personal-data/personal-data.module').then( m => m.PersonalDataPageModule),
    canActivate: [UserAuthGuard]
  },
  {
    path: 'physical-attributes',
    loadChildren: () => import('surya-lib/pages/physical-attributes/physical-attributes.module').then( m => m.PhysicalAttributesPageModule),
    canActivate: [UserAuthGuard]
  },
  {
    path: 'mind-setting',
    loadChildren: () => import('surya-lib/pages/mind-setting/mind-setting.module').then( m => m.MindSettingPageModule),
    canActivate: [UserAuthGuard]
  },
  {
    path: 'habbits',
    loadChildren: () => import('surya-lib/pages/habbits/habbits.module').then( m => m.HabbitsPageModule),
    canActivate: [UserAuthGuard]
  },
  {
    path: 'excrements',
    loadChildren: () => import('surya-lib/pages/excrements/excrements.module').then( m => m.ExcrementsPageModule),
    canActivate: [UserAuthGuard]
  },
  {
    path: 'medical-history',
    loadChildren: () => import('surya-lib/pages/medical-history/medical-history.module').then( m => m.MedicalHistoryPageModule),
    canActivate: [UserAuthGuard]
  },
  {
    path: 'goals',
    loadChildren: () => import('surya-lib/pages/goals/goals.module').then( m => m.GoalsPageModule),
    canActivate: [UserAuthGuard]
  },
  {
    path: 'plans',
    loadChildren: () => import('./pages/plans/plans.module').then( m => m.PlansPageModule)
  },
  {
    path: 'start',
    loadChildren: () => import('./pages/start/start.module').then( m => m.StartPageModule)
  },
//   {
//     path: 'login',
//     loadChildren: () => import('surya-lib/auth/pages/login/login.module').then( m => m.LoginPageModule)
//   },
  { path: 'login', component: LoginPage },
  {
    path: 'new-password',
    loadChildren: () => import('surya-lib/auth/pages/new-password/new-password.module').then( m => m.NewPasswordPageModule)
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
