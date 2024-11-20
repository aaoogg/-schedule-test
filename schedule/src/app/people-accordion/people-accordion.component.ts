import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { PeopleFormModalComponent } from '../components/people-form-modal/people-form-modal.component';
import { CustomButtonIconComponent } from '../components/custom-button-icon/custom-button-icon.component';
import { PeopleService } from '../service/people.service';

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
  cpf: string;
  endereco: Endereco;
  foto: Foto;
  id: number;
  nome: string;
  fotoUrl: string;
}

@Component({
  selector: 'app-people-accordion',
  templateUrl: './people-accordion.component.html',
  styleUrls: ['./people-accordion.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, CustomButtonIconComponent],
})
export class PeopleAccordionComponent {
  @Input() persons: Pessoa[] = [];
  @Output() onEditPerson = new EventEmitter<{ person: Pessoa; updatedPerson: Pessoa }>();
  @Output() onRemovePerson = new EventEmitter<Pessoa>();

  searchQuery: string = '';
  accordionStates: boolean[] = [];
  openedAccordion: string | null = null;
  peoples: Pessoa[] = [];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private peopleService: PeopleService
  ) { }

  get filteredPersons() {
    return this.persons.filter(person =>
      person.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleAccordion(name: string) {
    this.openedAccordion = this.openedAccordion === name ? null : name;
  }

  async editPerson(person: Pessoa) {
    const modal = await this.modalController.create({
      component: PeopleFormModalComponent,
      componentProps: {
        fields: [
          { name: 'logradouro', label: 'Logradouro', type: 'logradouro', required: true },
          { name: 'numero', label: 'Número', type: 'numero', required: true },
          { name: 'bairro', label: 'Bairro', type: 'bairro', required: true },
          { name: 'cidade', label: 'Cidade', type: 'cidade', required: true },
          { name: 'estado', label: 'Estado', type: 'estado', required: true },
          { name: 'cep', label: 'CEP', type: 'cep', required: true },
          { name: 'pais', label: 'Pais', type: 'pais', required: true }
        ],
        onSave: async (formData: any) => {
          if (!formData.value.nome || !formData.value.cpf) {
            this.presentAlert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
          }

          const confirmed = await this.presentConfirmAlert();
          if (confirmed === 'confirm') {
            const payload = {
              person: {
                id: person.id,
                cpf: formData.value.cpf,
                dataNascimento: formData.value.dataNascimento,
                email: formData.value.email,
                nome: formData.value.nome,
                password: formData.value.password,
                telefone: formData.value.telefone,
                username: formData.value.username
              }
            };

            this.peopleService.updatePerson(payload).subscribe(
              (response) => {
                console.log('Pessoa atualizada com sucesso', response);
                this.loadPersons();
                this.presentAlert('Sucesso', 'Pessoa atualizada com sucesso.');
              },
              (error) => {
                console.error('Erro ao atualizar pessoa', error);
                this.presentAlert('Erro', 'Ocorreu um erro ao atualizar pessoa.');
              }
            );
          }
        }
      }
    });

    return await modal.present();
  }

  loadPersons() {
    const userSessionData = JSON.parse(localStorage.getItem('userSession') || '{}');
    const id = userSessionData.id; // Acessando o identificador do usuário logado

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

  async removePerson(person: Pessoa) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: 'Tem certeza de que deseja excluir esta pessoa?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Excluir',
          handler: () => {
            this.peopleService.deletePerson(person.id).subscribe({
              next: () => {
                this.onRemovePerson.emit(person);
              },
              error: (err) => {
                console.error('Erro ao remover pessoa:', err);
                // Aqui você pode exibir uma mensagem de erro ao usuário
              }
            });
          }
        }
      ]
    });

    await alert.present();
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
            // Não faz nada específico, mas não precisamos fazer nada no handler
          }
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            // Não faz nada específico aqui também
          }
        }
      ]
    });

    await alert.present();

    // Espera o alerta ser fechado e retorna o valor do 'role' (confirm ou cancel)
    const { role } = await alert.onDidDismiss();

    // Retorna o valor de 'role', garantindo que não seja undefined
    return role || 'cancel';  // Se role for undefined, retorna 'cancel' por padrão
  }

  // Função para exibir alertas
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

    // Remover o prefixo data:image/png;base64, (ou qualquer outro tipo MIME)
    const base64Data = base64.split(',')[1]; // A parte após a vírgula

    if (!base64Data) {
      console.error('Dados Base64 inválidos.');
      return null;
    }

    // Decodificando a string base64
    const byteCharacters = atob(base64Data);
    const byteArrays = new Uint8Array(byteCharacters.length);

    // Preenchendo o array com os valores dos bytes
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }

    // Determinando o tipo MIME baseado no prefixo da string (ex: "image/png")
    const mimeType = base64.split(';')[0].split(':')[1];

    // Gerando o arquivo com o nome especificado
    const file = new File([byteArrays], filename, { type: mimeType });

    console.log('Arquivo gerado:', file); // Exibe o arquivo no console

    return file;
  }
}
