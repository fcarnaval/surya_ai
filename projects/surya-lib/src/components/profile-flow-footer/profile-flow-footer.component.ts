import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-profile-flow-footer',
  templateUrl: './profile-flow-footer.component.html',
  styleUrl: './profile-flow-footer.component.scss'
})
export class ProfileFlowFooterComponent {
  @Input() isNextDisabled: boolean = false;
  @Input() showPrevious: boolean = true;
  @Input() nextButtonText: string = 'Próximo';
  @Input() previousButtonText: string = 'Anterior';

  @Output() onPrevious = new EventEmitter<void>();
  @Output() onNext = new EventEmitter<void>();

  handlePrevious() {
    this.onPrevious.emit();
  }

  handleNext() {
    this.onNext.emit();
  }
}
