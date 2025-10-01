import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Import all page modules
import { PersonalDataPageModule } from './personal-data/personal-data.module';
import { PhysicalAttributesPageModule } from './physical-attributes/physical-attributes.module';
import { MindSettingPageModule } from './mind-setting/mind-setting.module';
import { HabbitsPageModule } from './habbits/habbits.module';
import { ExcrementsPageModule } from './excrements/excrements.module';
import { MedicalHistoryPageModule } from './medical-history/medical-history.module';
import { GoalsPageModule } from './goals/goals.module';
import { TongueCapturePageModule } from './tongue-capture/tongue-capture.module';

// Import shared components
import { ProfileFlowFooterModule } from '../components/profile-flow-footer/profile-flow-footer.module';
import { HeaderModule } from '../components/header/header.module';
import { MealsModuleComponentModule } from '../components/meals-modal/meals-modal.module';

// Export page components for external use
export { PersonalDataPage } from './personal-data/personal-data.page';
export { PhysicalAttributesPage } from './physical-attributes/physical-attributes.page';
export { MindSettingPage } from './mind-setting/mind-setting.page';
export { HabbitsPage } from './habbits/habbits.page';
export { ExcrementsPage } from './excrements/excrements.page';
export { MedicalHistoryPage } from './medical-history/medical-history.page';
export { GoalsPage } from './goals/goals.page';
export { TongueCapturePage } from './tongue-capture/tongue-capture.page';

// Export components
export { ProfileFlowFooterComponent } from '../components/profile-flow-footer/profile-flow-footer.component';
export { HeaderComponent } from '../components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    // Page modules
    PersonalDataPageModule,
    PhysicalAttributesPageModule,
    MindSettingPageModule,
    HabbitsPageModule,
    ExcrementsPageModule,
    MedicalHistoryPageModule,
    GoalsPageModule,
    TongueCapturePageModule,
    // Shared component modules
    ProfileFlowFooterModule,
    HeaderModule,
    MealsModuleComponentModule
  ],
  exports: [
    // Re-export all page modules for routing
    PersonalDataPageModule,
    PhysicalAttributesPageModule,
    MindSettingPageModule,
    HabbitsPageModule,
    ExcrementsPageModule,
    MedicalHistoryPageModule,
    GoalsPageModule,
    TongueCapturePageModule,
    // Re-export shared component modules
    ProfileFlowFooterModule,
    HeaderModule,
    MealsModuleComponentModule
  ]
})
export class ProfileFlowModule {}