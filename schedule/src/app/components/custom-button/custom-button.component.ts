import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class CustomButtonComponent {
  @Input() buttonType: 'save' | 'cancel' | 'edit' | 'delete' | 'entrar' | 'sair' = 'save';
  @Output() onClick = new EventEmitter<void>();
  @Input() disabled: boolean = false;

  get buttonClass(): string {
    switch (this.buttonType) {
      case 'save':
      case 'entrar':
      case 'cancel':
        return 'rounded-button';
      default:
        return '';
    }
  }

  get buttonColor(): string {
    switch (this.buttonType) {
      case 'save':
      case 'entrar':
        return 'primary';
      case 'cancel':
        return 'danger';
      default:
        return 'default';
    }
  }
}
