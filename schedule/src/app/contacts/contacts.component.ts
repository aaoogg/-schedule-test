import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CustomButtonIconComponent } from '../components/custom-button-icon/custom-button-icon.component';
import { ContactFormModalComponent } from '../components/contact-form-modal/contact-form-modal.component';
import { ContactsAccordionComponent } from '../contacts-accordion/contacts-accordion.component';
import { ContactService } from '../service/contact.service';
import { AlertController } from '@ionic/angular/standalone';

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

interface Foto {
  id: string;
  name: string;
  type: string;
}

interface Pessoa {
  cpf: string;
  endereco: Endereco;
  foto: Foto;
  id: number;
  nome: string;
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

@Component({
  selector: 'app-contacts',
  standalone: true,
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomButtonIconComponent,
    ContactFormModalComponent,
    ContactsAccordionComponent
  ]
})
export class ContactsComponent implements OnInit {
  searchQuery: string = '';
  contacts: Contact[] = [];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private contactService: ContactService
  ) { }

  ngOnInit() {
    this.loadContacts();
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

  searchContacts() {
    if (this.searchQuery.trim() === '') {
      this.loadContacts();
    } else {
      this.contactService.searchContacts(this.searchQuery).subscribe(
        (response: any[]) => {
          this.contacts = response;
        },
        (error) => {
          console.error('Erro ao pesquisar contatos', error);
        }
      );
    }
  }

  removeContact(contact: Contact) {
    this.contacts = this.contacts.filter(c => c.id !== contact.id);
  }

  async addContact() {
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
          { name: 'dataNascimento', label: 'Data de Nascimento', type: 'date', required: true }

        ],
        onSave: async (formData: any) => {
          if (!formData.email || !formData.telefone || !formData.tipoContato ||
            !formData.logradouro || !formData.numero || !formData.bairro ||
            !formData.cidade || !formData.estado || !formData.cep) {
            this.presentAlert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
          }

          const confirmed = await this.presentConfirmAlert();
          if (confirmed === 'confirm') {
            const payload = {
              email: formData.email,
              pessoa: {
                cpf: formData.cpf,
                endereco: {
                  logradouro: formData.rua,
                  numero: formData.numero,
                  bairro: formData.bairro,
                  cidade: formData.cidade,
                  estado: formData.estado,
                  cep: formData.cep,
                  pais: formData.pais
                },
              },
              foto: this.dataURLtoFile(formData.foto),
              privado: formData.privado,
              tag: formData.tag,
              telefone: formData.telefone,
              tipoContato: formData.tipoContato,
              usuario: {
                cpf: formData.cpf,
                dataNascimento: formData.dataNascimento,
                email: formData.email,
                nome: formData.nome,
                password: formData.password,
                telefone: formData.telefone,
                username: formData.username
              }
            };

            this.contactService.saveContact(payload).subscribe(
              (response) => {
                console.log('Contato adicionado com sucesso', response);
                this.loadContacts();

                this.presentAlert('Sucesso!', 'Contato cadastrado com sucesso.');
              },
              (error) => {
                console.error('Erro ao adicionar contato', error);

                this.presentAlert('Erro', 'Ocorreu um erro ao cadastrar o contato.');
              }
            );
          }
        }
      }
    });

    await modal.present();

  }

  saveContact(contactData: any) {
    const contactPayload = {
      email: contactData.email,
      telefone: contactData.telefone,
      tag: contactData.tag,
      tipoContato: contactData.tipoContato,
      privado: true,
      pessoa: {
        cpf: contactData.cpf,
        endereco: contactData.endereco,
        foto: contactData.foto,
        nome: contactData.nome
      },
      usuario: {
        cpf: contactData.cpf,
        dataNascimento: contactData.dataNascimento,
        email: contactData.email,
        id: contactData.id,
        nome: contactData.nome,
        password: contactData.password,
        telefone: contactData.telefone,
        username: contactData.username
      }
    };

    this.contactService.saveContact(contactPayload).subscribe(
      (response) => {
        console.log('Contato adicionado com sucesso', response);
        this.loadContacts();
      },
      (error) => {
        console.error('Erro ao adicionar contato', error);
      }
    );
  }

  async editContact(contact: Contact) {
    const modal = await this.modalController.create({
      component: ContactFormModalComponent,
      componentProps: {
        fields: [
          { name: 'email', label: 'Email', type: 'email', value: contact.email, required: true },
          { name: 'telefone', label: 'Telefone', type: 'text', value: contact.telefone, required: true },
          { name: 'tag', label: 'Tag', type: 'text', value: contact.tag, required: false },
          { name: 'tipoContato', label: 'Tipo de Contato', type: 'text', value: contact.tipoContato, required: true }
        ]
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        contact.email = result.data.email || contact.email;
        contact.telefone = result.data.telefone || contact.telefone;
        contact.tag = result.data.tag || contact.tag;
        contact.tipoContato = result.data.tipoContato || contact.tipoContato;
        this.loadContacts();
      }
    });

    return await modal.present();
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
