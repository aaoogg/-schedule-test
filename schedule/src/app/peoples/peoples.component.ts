import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CustomButtonIconComponent } from '../components/custom-button-icon/custom-button-icon.component';
import { PeopleFormModalComponent } from '../components/people-form-modal/people-form-modal.component';
import { PeopleAccordionComponent } from '../people-accordion/people-accordion.component';
import { PeopleService } from '../service/people.service';
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

interface Pessoa {
  id: number;
  nome: string;
  cpf: string;
  endereco: Endereco;
  foto: Foto;
  fotoUrl: string;
}

@Component({
  selector: 'app-peoples',
  standalone: true,
  templateUrl: './peoples.component.html',
  styleUrls: ['./peoples.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomButtonIconComponent,
    PeopleFormModalComponent,
    PeopleAccordionComponent
  ]
})
export class PeoplesComponent implements OnInit {
  searchQuery: string = '';
  peoples: Pessoa[] = [];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private peopleService: PeopleService
  ) { }

  ngOnInit() {
    this.loadPeoples();
  }

  loadPeoples() {
    const userSessionData = JSON.parse(localStorage.getItem('userSession') || '{}');
    const id = userSessionData.id;

    this.peopleService.getById(id).subscribe(
      (response: any) => {
        console.log('Resposta da API:', response);

        if (response && response.object && response.object.nome) {
          const pessoa: Pessoa = {
            id: response.object.id,
            nome: response.object.nome,
            cpf: response.object.cpf,
            endereco: response.object.endereco,
            foto: response.object.foto,
            fotoUrl: response.object.foto
          };

          this.peoples = [pessoa];

          console.log('Pessoas carregadas:', this.peoples);
        } else {
          console.warn('Nenhuma pessoa encontrada ou a estrutura da resposta está incorreta.');
        }
      },
      (error) => {
        console.error('Erro ao carregar pessoas', error);
      }
    );
  }

  searchPeoples() {
    if (this.searchQuery.trim() === '') {
      this.loadPeoples();
    } else {
      this.peopleService.searchPeople(this.searchQuery).subscribe(
        (response: Pessoa[]) => {
          this.peoples = response;
        },
        (error) => {
          console.error('Erro ao pesquisar pessoas', error);
        }
      );
    }
  }

  get filteredPeoples() {
    return this.peoples.filter(person =>
      person.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  removePerson(person: Pessoa) {
    this.peopleService.deletePerson(person.id).subscribe(
      (response) => {
        console.log('Pessoa removida com sucesso');
        this.peoples = this.peoples.filter(p => p.id !== person.id);
      },
      (error) => {
        console.error('Erro ao remover pessoa', error);
      }
    );
  }

  async addPerson() {
    const modal = await this.modalController.create({
      component: PeopleFormModalComponent,
      componentProps: {
        fields: [
          { name: 'nome', label: 'Nome', type: 'nome', required: true },
          { name: 'telefone', label: 'Telefone', type: 'telefone', required: true },
          { name: 'cpf', label: 'CPF', type: 'cpf', required: true },
          //Endereço
          { name: 'logradouro', label: 'Logradouro', type: 'logradouro', required: true },
          { name: 'numero', label: 'Número', type: 'numero', required: true },
          { name: 'bairro', label: 'Bairro', type: 'bairro', required: true },
          { name: 'cidade', label: 'Cidade', type: 'cidade', required: true },
          { name: 'estado', label: 'Estado', type: 'estado', required: true },
          { name: 'cep', label: 'CEP', type: 'cep', required: true },
          { name: 'pais', label: 'Pais', type: 'pais', required: true }

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
              nome: formData.nome,
              foto: this.dataURLtoFile(formData.foto),
              telefone: formData.telefone,
            };

            this.peopleService.savePeople(payload).subscribe(
              (response: any) => {
                console.log('Pessoa adicionado com sucesso', response);
                this.loadPeoples();

                this.presentAlert('Sucesso!', 'Pessoa cadastrado com sucesso.');
              },
              (error: any) => {
                console.error('Erro ao adicionar pessoa', error);
                this.presentAlert('Erro', 'Ocorreu um erro ao cadastrar o pessoa.');
              }
            );
          }
        }
      }
    });

    await modal.present();

  }

  async editPerson(person: Pessoa) {
    const modal = await this.modalController.create({
      component: PeopleFormModalComponent,
      componentProps: {
        fields: [
          { name: 'nome', label: 'Nome', type: 'nome', value: person.nome, required: false },
        ]
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
