import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-custom-icon',
  templateUrl: './custom-icon.component.html',
  styleUrls: ['./custom-icon.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CustomIconComponent {
  @Input() iconSrc: string = '';
  @Input() altText: string = 'Ícone';
  @Input() size: number = 100;
  @Input() src: string = '';
}
