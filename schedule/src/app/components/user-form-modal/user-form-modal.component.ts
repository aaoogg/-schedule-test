import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { ModalController } from '@ionic/angular';

export interface Field {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  editable?: boolean;
  value?: any;
  placeholder?: string;
  mask?: string;
  options?: { label: string; value: any }[];
  imageSrc?: string;
}

@Component({
  standalone: true,
  selector: 'app-user-form-modal',
  templateUrl: './user-form-modal.component.html',
  styleUrls: ['./user-form-modal.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    CustomButtonComponent,
    CustomInputComponent,
    ReactiveFormsModule
  ],
})
export class UserFormModalComponent implements OnInit {
  @Input() fields: Array<any> = [];
  @Input() onSave: (formData: any) => void = () => { };
  @Output() submitForm = new EventEmitter<any>();
  form!: FormGroup;

  hasError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
  ) { }

  onErrorChange(hasError: boolean): void {
    this.hasError = hasError;
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    const formGroup: { [key: string]: any } = {};
    this.fields.forEach(field => {
      formGroup[field.name] = [
        field.value || '',
        field.required ? Validators.required : null,
      ];
    });
    this.form = this.fb.group(formGroup);
  }


  clear() {
    this.form.reset();
    this.modalController.dismiss({ cleared: true });
  }
}