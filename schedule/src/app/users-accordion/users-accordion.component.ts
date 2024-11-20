import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { UserFormModalComponent } from '../components/user-form-modal/user-form-modal.component';
import { UserService } from '../service/user.service';
import { CustomButtonIconComponent } from '../components/custom-button-icon/custom-button-icon.component';
import { AlertController } from '@ionic/angular/standalone';

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

@Component({
  selector: 'app-users-accordion',
  templateUrl: './users-accordion.component.html',
  styleUrls: ['./users-accordion.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, CustomButtonIconComponent],
})
export class UsersAccordionComponent {
  @Input() users: any[] = [];
  @Output() onEditUser = new EventEmitter<{ user: any; updatedUser: any }>();
  @Output() onRemoveUser = new EventEmitter<any>();

  searchQuery: string = '';
  accordionStates: boolean[] = [];
  openedAccordion: string | null = null;
  usuarios: Usuario[] = [];
  formIsValid: boolean = false;

  constructor(private modalController: ModalController, private userService: UserService,
    private alertController: AlertController
  ) { }

  get filteredUsers() {
    return this.users.filter(user =>
      user.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleAccordion(name: string) {
    this.openedAccordion = this.openedAccordion === name ? null : name;
  }

  async editUser(usuario: Usuario) {
    this.formIsValid = true;
    const modal = await this.modalController.create({
      component: UserFormModalComponent,
      componentProps: {
        fields: [
          { name: 'nome', label: 'Nome', type: 'nome', value: usuario.nome, required: true },
          { name: 'cpf', label: 'CPF', type: 'cpf', value: usuario.cpf ?? '', required: true, mask: '000.000.000-00' },
          { name: 'dataNascimento', label: 'Data de Nascimento', type: 'date', value: usuario.dataNascimento ?? '', required: false },
          { name: 'email', label: 'Email', type: 'email', value: usuario.email ?? '', required: false },
          { name: 'telefone', label: 'Telefone', type: 'telefone', value: usuario.telefone ?? '', required: false },
          { name: 'username', label: 'Username', type: 'nome', value: usuario.username ?? '', required: false },
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
                id: usuario.id,
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
              this.userService.updateUser(payload).subscribe(
                (response) => {
                  console.log('Usuário atualizado com sucesso', response);
                  this.loadUsers();
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

  async presentConfirmAlert(): Promise<string> {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja salvar o usuário?',
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

  async editPassword(user: any) {
    this.formIsValid = true;
    const modal = await this.modalController.create({
      component: UserFormModalComponent,
      componentProps: {
        fields: [
          { id: 8, name: 'newPassword', label: 'Nova Senha', type: 'password', value: '', required: true },
          { id: 9, name: 'confirmPassword', label: 'Repetir Nova Senha', type: 'password', value: '', required: true },
        ],
        onSave: async (formData: any) => {
          console.log('Form data recebidos:', formData.value);

          if (!formData.value.newPassword || !formData.value.confirmPassword) {
            this.presentAlert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            this.formIsValid = false;
            return;
          }

          if (formData.value.newPassword !== formData.value.confirmPassword) {
            this.presentAlert('Erro', 'As senhas não coincidem.');
            this.formIsValid = false;
            return;
          }

          const confirmed = await this.presentConfirmAlert();
          if (confirmed === 'confirm') {
            const payload = {
              newPassword: formData.value.newPassword,
              password: user.password,
              username: user.username,
            };
            if (this.formIsValid) {
              this.userService.changePassword(payload).subscribe(
                (response) => {
                  console.log('Usuário atualizado com sucesso', response);
                  this.loadUsers();
                  this.presentAlert('Sucesso', 'Senha atualizada com sucesso.');
                },
                (error) => {
                  console.error('Erro ao atualizar senha', error);
                  this.presentAlert('Erro', 'Ocorreu um erro ao atualizar a senha.');
                }
              );
            }
          }
        }
      },
    });

    await modal.present();
  }

  async deleteUser(usuario: Usuario) {
    console.log(usuario.id);
    const confirmed = await this.presentConfirmAlert();

    if (confirmed === 'confirm') {
      this.userService.deleteUser(usuario.id).subscribe(
        (response) => {
          console.log('Usuário deletado com sucesso', response);
          this.loadUsers();
          this.presentAlert('Sucesso!', 'Usuário deletado com sucesso.');
        },
        (error) => {
          console.error('Erro ao deletar usuário', error);
          this.presentAlert('Erro', 'Ocorreu um erro ao deletar o usuário.');
        }
      );
    }
  }

  loadUsers() {
    const userSessionData = JSON.parse(localStorage.getItem('userSession') || '{}');
    const id = userSessionData.id;
    this.userService.getUserDetails(id).subscribe(
      (response: any) => {
        if (response && response.object && response.object.usuario) {
          const usuario = response.object.usuario;
          this.usuarios = [
            {
              id: usuario.id,
              nome: usuario.nome,
              cpf: usuario.cpf,
              dataNascimento: usuario.dataNascimento,
              email: usuario.email,
              password: usuario.password,
              telefone: usuario.telefone,
              username: usuario.username,
            }
          ];
        }
      },
      (error) => {
        console.error('Erro ao carregar usuários', error);
      }
    );
  }
}
