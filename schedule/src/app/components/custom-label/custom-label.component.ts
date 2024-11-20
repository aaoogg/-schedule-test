import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-custom-label',
  templateUrl: './custom-label.component.html',
  styleUrls: ['./custom-label.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})

export class CustomLabelComponent {
  @Input() text: string = '';
}

