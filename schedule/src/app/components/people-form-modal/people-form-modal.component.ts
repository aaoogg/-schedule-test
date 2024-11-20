import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { ModalController } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
  selector: 'app-people-form-modal',
  templateUrl: './people-form-modal.component.html',
  styleUrls: ['./people-form-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    CustomButtonComponent,
    CustomInputComponent,
    ReactiveFormsModule
  ],
})
export class PeopleFormModalComponent implements OnInit {
  @Input() fields: Array<any> = [];
  @Input() onSave: (formData: any) => void = () => { };
  @Output() submitForm = new EventEmitter<any>();
  form!: FormGroup;
  imageSrc: string | null = null;
  hasError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    const formGroup: { [key: string]: any } = {};

    this.fields.forEach(field => {
      if (field.name === 'foto') {
        formGroup['foto'] = [this.imageSrc || '', field.required ? Validators.required : null];
      } else {
        formGroup[field.name] = [
          field.value || '',
          field.required ? Validators.required : null,
        ];
      }
    });

    this.form = this.fb.group(formGroup);

  }

  onErrorChange(hasError: boolean): void {
    this.hasError = hasError;
  }

  async onFileClick(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Escolha uma opção',
      buttons: [
        {
          text: 'Carregar foto',
          handler: () => {
            this.openFileInput();
          },
        },
        {
          text: 'Tirar foto',
          handler: () => {
            this.takePhoto();
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }

  openFileInput(): void {
    const fileInput = document.querySelector<HTMLInputElement>('#fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }

  async takePhoto(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      this.imageSrc = image.dataUrl || null;
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  submit() {
    this.form.value.foto = this.imageSrc;
    this.onSave(this.form.value);
  }

  clear() {
    this.form.reset();
    this.modalController.dismiss({ cleared: true });
  }
}