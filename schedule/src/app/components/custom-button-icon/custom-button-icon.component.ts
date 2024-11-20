import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  createOutline,
  trashOutline,
  logInOutline,
  logOutOutline,
  personOutline,
  addOutline,
  lockOpenOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-custom-button-icon',
  standalone: true,
  templateUrl: './custom-button-icon.component.html',
  styleUrls: ['./custom-button-icon.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class CustomButtonIconComponent {
  @Input() buttonType: 'edit' | 'delete' | 'account' | 'logout' | 'add' | 'lock' = 'edit';
  @Output() onClick = new EventEmitter<void>();
  @Input() disabled: boolean = false;
  @Input() buttonColor: string = 'var(--ion-color-light)';

  constructor() {
    addIcons({
      createOutline,
      trashOutline,
      logInOutline,
      logOutOutline,
      personOutline,
      addOutline,
      lockOpenOutline
    });
  }

  get iconName(): string {
    switch (this.buttonType) {
      case 'edit':
        return 'create-outline';
      case 'delete':
        return 'trash-outline';
      case 'account':
        return 'person-outline';
      case 'logout':
        return 'log-out-outline';
      case 'add':
        return 'add-outline';
      case 'lock':
        return 'lock-open-outline';
      default:
        return '';
    }
  }
}
