import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomLabelComponent } from '../custom-label/custom-label.component';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, CustomLabelComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() labelText: string = '';
  @Input() type: string = '';
  @Input() placeholder: string = '';
  @Input() name: string = '';
  @Output() errorChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  private size: number = 30;
  errorMessage: string = '';

  private innerValue: string = '';
  onChange: (value: string) => void = () => { };
  onTouched: () => void = () => { };

  get value(): string {
    return this.innerValue;
  }

  set value(val: string) {
    this.innerValue = val;
    this.onChange(val);
    this.onTouched();
  }

  writeValue(value: string): void {
    this.innerValue = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleInput(event: any): void {
    let value = event.target.value;

    if (this.type === 'cpf') {
      if (/[a-zA-Z]/.test(value)) {
        this.errorChange.emit(true);
        this.errorMessage = 'O CPF não pode conter letras.';
        value = value.replace(/[a-zA-Z]/g, '');
      } else {
        this.errorMessage = '';
      }
      value = this.cpfMask(value);
    }

    if (this.type === 'telefone') {
      if (/[a-zA-Z]/.test(value)) {
        this.errorChange.emit(true);
        this.errorMessage = 'O telefone não pode conter letras.';
        value = value.replace(/[a-zA-Z]/g, '');
      } else {
        this.errorMessage = '';
      }
      value = this.telefoneMask(value);
    }

    if (this.type === 'nome' || this.type === 'pais' || this.type === 'estado') {
      if (/\d/.test(value)) {
        this.errorChange.emit(true);
        this.errorMessage = `O ${this.type} não pode conter números.`;
        value = value.replace(/\d/g, '');
      } else {
        this.errorMessage = '';
        this.errorChange.emit(false);
      }
      value = this.nomeMask(value);
    }

    if (this.type === 'email') {
      value = this.emailMask(value);
      if (!this.isValidEmail(value)) {
        this.errorChange.emit(true);
        this.errorMessage = 'Por favor, insira um email válido.';
      } else {
        this.errorMessage = '';
        this.errorChange.emit(false);
      }
    }

    if (this.type === 'password') {
      if (!this.isValidPassword(value)) {
        this.errorMessage = 'A senha deve conter letras e números.';
        this.errorChange.emit(true);
      } else {
        this.errorMessage = '';
        this.errorChange.emit(false);
      }
    }

    if (this.type === 'cep') {
      if (/[a-zA-Z]/.test(value)) {
        this.errorChange.emit(true);
        this.errorMessage = 'O CEP não pode conter letras.';
        value = value.replace(/[a-zA-Z]/g, '');
      } else {
        this.errorMessage = '';
      }
      value = this.cepMask(value);
    }

    this.value = value;
  }

  private isValidEmail(value: string): boolean {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
  }

  private isValidPassword(value: string): boolean {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value);
  }

  getMaxLength(): number {
    switch (this.type) {
      case 'cpf':
        return 14;
      case 'telefone':
        return 15;
      case 'email':
        return 30;
      case 'nome':
        return 30;
      case 'username':
        return 15;
      case 'cep':
        return 9;
      case 'numero':
        return 5;
      case 'logradouro':
        return 30;
      case 'pais':
        return 25;
      case 'estado':
        return 2;
      case 'cidade':
        return 25;
      case 'bairro':
        return 30;
      default:
        return this.size;
    }
  }

  private cpfMask(value: string): string {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  private telefoneMask(value: string): string {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  }

  private nomeMask(value: string): string {
    return value.replace(/[^A-Za-zÀ-ú\s]/g, '');
  }

  private emailMask(value: string): string {
    return value;
  }

  private cepMask(value: string): string {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d{1,3})$/, '$1-$2');
  }
}
