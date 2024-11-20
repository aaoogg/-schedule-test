import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CustomButtonIconComponent } from '../components/custom-button-icon/custom-button-icon.component';
import { UserFormModalComponent } from '../components/user-form-modal/user-form-modal.component';
import { UsersAccordionComponent } from '../users-accordion/users-accordion.component';
import { UserService } from '../service/user.service';
import { AlertController } from '@ionic/angular';

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
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomButtonIconComponent,
    UserFormModalComponent,
    UsersAccordionComponent
  ]
})

export class UsersComponent implements OnInit {
  searchQuery: string = '';
  usuarios: Usuario[] = [];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadUsers();
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

  searchUsers() {
    if (this.searchQuery.trim() === '') {
      this.loadUsers();
    } else {
      this.userService.searchUsers(this.searchQuery).subscribe(
        (response: any[]) => {
          this.usuarios = response;
        },
        (error) => {
          console.error('Erro ao pesquisar usuários', error);
        }
      );
    }
  }

  removeUser(usuario: Usuario) {
    this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
  }

  async addUser() {
    const modal = await this.modalController.create({
      component: UserFormModalComponent,
      componentProps: {
        fields: [
          { name: 'nome', label: 'Nome', type: 'nome', required: true },
          { name: 'cpf', label: 'CPF', type: 'cpf', required: true },
          { name: 'dataNascimento', label: 'Data de Nascimento', type: 'date', required: false },
          { name: 'email', label: 'Email', type: 'email', required: false },
          { name: 'password', label: 'Senha', type: 'password', required: true },
          { name: 'telefone', label: 'Telefone', type: 'telefone', required: false },
          { name: 'username', label: 'Username', type: 'username', required: true },
          {
            name: 'role',
            label: 'Função',
            type: 'select',
            required: true,
            options: [
              { label: 'Usuário', value: 'usuario' },
              { label: 'Admin', value: 'admin' }
            ]
          }
        ],
        onSave: async (formData: any) => {
          console.log('Form data recebidos:', formData.value);

          if (!formData.value.nome || !formData.value.cpf || !formData.value.password || !formData.value.username || !formData.value.role) {
            this.presentAlert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
          }

          const confirmed = await this.presentConfirmAlert();
          console.log(confirmed);
          if (confirmed == 'confirm') {
            let tipos: string[] = [];
            if (formData.value.role === 'usuario') {
              tipos.push('ROLE_USER');
            } else if (formData.value.role === 'admin') {
              tipos.push('ROLE_ADMIN');
            }

            const payload = {
              tipos: tipos,
              usuario: {
                cpf: formData.value.cpf,
                dataNascimento: formData.value.dataNascimento,
                email: formData.value.email,
                nome: formData.value.nome,
                password: formData.value.password,
                telefone: formData.value.telefone,
                username: formData.value.username
              }
            };

            this.userService.saveUser(payload).subscribe(
              (response) => {
                console.log('Usuário adicionado com sucesso', response);
                this.loadUsers();

                this.presentAlert('Sucesso!', 'Usuário cadastrado com sucesso.');
              },
              (error) => {
                console.error('Erro ao adicionar usuário', error);

                this.presentAlert('Erro', 'Ocorreu um erro ao cadastrar o usuário.');
              }
            );
          }
        }
      }
    });

    await modal.present();
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
}
