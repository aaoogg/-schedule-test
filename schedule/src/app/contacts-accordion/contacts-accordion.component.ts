import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { ContactFormModalComponent } from '../components/contact-form-modal/contact-form-modal.component';
import { CustomButtonIconComponent } from '../components/custom-button-icon/custom-button-icon.component';
import { addIcons } from 'ionicons';
import { heart } from 'ionicons/icons';
import { ContactService } from '../service/contact.service';
import { AlertController } from '@ionic/angular/standalone';

interface Foto {
  id: string;
  name: string;
  type: string;
}

interface Endereco {
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  id: number;
  logradouro: string;
  numero: number;
  pais: string;
}

interface Usuario {
  cpf: string;
  dataNascimento: string;
  email: string;
  id: number;
  nome: string;
  password: string;
  telefone: string;
  username: string;
}

interface Contact {
  email: string;
  id: number;
  pessoa: Pessoa;
  privado: boolean;
  tag: string;
  telefone: string;
  tipoContato: string;
  usuario: Usuario;
  fotoUrl: string;
}

interface Pessoa {
  cpf: string;
  endereco: Endereco;
  foto: Foto;
  id: number;
  nome: string;
}

@Component({
  selector: 'app-contacts-accordion',
  templateUrl: './contacts-accordion.component.html',
  styleUrls: ['./contacts-accordion.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, CustomButtonIconComponent],
})
export class ContactsAccordionComponent {
  @Input() contacts: Contact[] = [];  // Usando a interface Contato
  @Output() onEditContact = new EventEmitter<{ contact: Contact; updatedContact: Contact }>();
  @Output() onRemoveContact = new EventEmitter<Contact>();

  searchQuery: string = '';
  isAccordionOpen: boolean = false;
  openedAccordion: string | null = null;
  formIsValid: boolean = false;

  constructor(private modalController: ModalController, private contactService: ContactService, private alertController: AlertController) {
    addIcons({ heart });
  }

  toggleAccordion(name: string) {
    this.openedAccordion = this.openedAccordion === name ? null : name;
  }

  get filteredContacts() {
    return this.contacts.filter(contact =>
      contact.pessoa.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  async editContact(contact: Contact) {
    this.formIsValid = true;
    const modal = await this.modalController.create({
      component: ContactFormModalComponent,
      componentProps: {
        fields: [
          { name: 'nome', label: 'Nome', type: 'nome', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'telefone', label: 'Telefone', type: 'text', required: true },
          { name: 'tag', label: 'Tag', type: 'text', required: false },
          { name: 'tipoContato', label: 'Tipo de Contato', type: 'text', required: true },
          { name: 'privado', label: 'Privado', type: 'text', required: true },
          { name: 'cpf', label: 'CPF', type: 'cpf', required: true },
          { name: 'logradouro', label: 'Logradouro', type: 'text', required: true },
          { name: 'numero', label: 'Número', type: 'text', required: true },
          { name: 'bairro', label: 'Bairro', type: 'text', required: true },
          { name: 'cidade', label: 'Cidade', type: 'text', required: true },
          { name: 'estado', label: 'Estado', type: 'text', required: true },
          { name: 'cep', label: 'CEP', type: 'text', required: true },
          { name: 'pais', label: 'Pais', type: 'pais', required: true },
          { name: 'username', label: 'Usuario', type: 'text', required: true },
          { name: 'dataNascimento', label: 'Data de Nascimento', type: 'date', required: true },
          { name: 'password', label: 'Senha', type: 'password', required: true },
          { name: 'password', label: 'Repita a senha', type: 'password', required: true },

        ],
        onSave: async (formData: any) => {
          if (!formData.value.nome || !formData.value.cpf || !formData.value.username || !formData.value.email) {
            this.presentAlert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            this.formIsValid = false;
            return;
          }

          const confirmed = await this.presentConfirmAlert();
          if (confirmed === 'confirm') {
            const payload = {
              usuario: {
                id: contact.id,
                cpf: formData.value.cpf,
                dataNascimento: formData.value.dataNascimento,
                email: formData.value.email,
                nome: formData.value.nome,
                password: formData.value.password,
                telefone: formData.value.telefone,
                username: formData.value.username
              }
            };
            if (this.formIsValid) {
              this.contactService.updateContact(payload).subscribe(
                (response) => {
                  console.log('Usuário atualizado com sucesso', response);
                  this.loadContacts();
                  this.presentAlert('Sucesso', 'Usuário atualizado com sucesso.');
                },
                (error) => {
                  console.error('Erro ao atualizar usuário', error);
                  this.presentAlert('Erro', 'Ocorreu um erro ao atualizar o usuário.');
                }
              );
            } else {
              this.presentAlert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            }
          }
        }
      }
    });

    return await modal.present();
  }

  loadContacts() {
    const userSessionData = JSON.parse(localStorage.getItem('userSession') || '{}');
    const id = userSessionData.id;

    this.contactService.getContactsByPersonId(id).subscribe(
      async (response: any[]) => {
        if (response && response.length > 0) {
          this.contacts = await Promise.all(response.map(async (contact) => {
            const fotoUrl = await this.getPhotoUrl(contact.pessoa.foto.id);

            return {
              id: contact.id,
              email: contact.email,
              pessoa: {
                id: contact.pessoa.id,
                nome: contact.pessoa.nome,
                cpf: contact.pessoa.cpf,
                endereco: contact.pessoa.endereco,
                foto: contact.pessoa.foto
              },
              privado: contact.privado,
              tag: contact.tag,
              telefone: contact.telefone,
              tipoContato: contact.tipoContato,
              usuario: {
                id: contact.usuario.id,
                nome: contact.usuario.nome,
                cpf: contact.usuario.cpf,
                dataNascimento: contact.usuario.dataNascimento,
                email: contact.usuario.email,
                password: contact.usuario.password,
                telefone: contact.usuario.telefone,
                username: contact.usuario.username
              },
              fotoUrl: fotoUrl,
            };
          }));
        }
      },
      (error) => {
        console.error('Erro ao carregar contatos', error);
      }
    );
  }

  async getPhotoUrl(photoId: string): Promise<string> {
    console.log('chamou');
    try {
      const photoUrl = await this.loadPhoto(photoId);
      return photoUrl;
    } catch (error) {
      console.error('Erro ao obter URL da foto', error);
      return '';
    }
  }

  loadPhoto(photoId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.contactService.downloadPhoto(photoId).subscribe({
        next: (blob) => {
          const photoUrl = URL.createObjectURL(blob);
          resolve(photoUrl);
        },
        error: (err) => {
          console.error('Erro ao carregar foto', err);
          reject('Erro ao carregar foto');
        }
      });
    });
  }

  removeContact(contact: Contact) {
    this.onRemoveContact.emit(contact);
  }

  toggleFavorite(contact: Contact) {
    contact.privado = !contact.privado;

    this.contactService.toggleFavorite(contact).subscribe({
      next: (updatedContact) => {
        console.log('Contato atualizado com sucesso', updatedContact);
      },
      error: (error) => {
        console.error('Erro ao atualizar o contato', error);
        contact.privado = !contact.privado;
      }
    });
  }

  async presentConfirmAlert(): Promise<string> {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja salvar o contato?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();

    return role || 'cancel';
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  dataURLtoFile(base64: string, filename: string = 'image.png'): File | null {
    if (!base64) {
      console.error('Base64 é inválido ou nulo.');
      return null;
    }

    const base64Data = base64.split(',')[1];

    if (!base64Data) {
      console.error('Dados Base64 inválidos.');
      return null;
    }

    const byteCharacters = atob(base64Data);
    const byteArrays = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }

    const mimeType = base64.split(';')[0].split(':')[1];

    const file = new File([byteArrays], filename, { type: mimeType });

    console.log('Arquivo gerado:', file);

    return file;
  }
}
