import { CommonModule } from '@angular/common';
import { AlertController, IonicModule, MenuController } from '@ionic/angular';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CustomButtonIconComponent } from '../components/custom-button-icon/custom-button-icon.component';
import { ModalController } from '@ionic/angular/standalone';
import { UserService } from '../service/user.service';
import { UserFormModalComponent } from '../components/user-form-modal/user-form-modal.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [CommonModule, IonicModule, RouterModule, CustomButtonIconComponent]
})
export class MenuComponent {
  currentSection: string = 'Tela Inicial';
  formIsValid: boolean = false;

  constructor(private router: Router, private menuController: MenuController, private modalController: ModalController,
    private alertController: AlertController, private userService: UserService) { }

  selectSection(section: string) {
    const sectionNames: { [key: string]: string } = {
      home: 'Tela Inicial',
      users: 'Usuários',
      peoples: 'Pessoas',
      contacts: 'Contatos',
    };

    this.currentSection = sectionNames[section] || section;
    this.router.navigate(['/menu', section.toLowerCase()]);
    this.menuController.close();
  }

  logout() {
    localStorage.removeItem('userSession');
    this.router.navigate(['/login']);
  }

  async editUser() {
    this.formIsValid = true;

    const userSessionData = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userId = userSessionData.id;

    if (!userId) {
      this.presentAlert('Erro', 'Usuário não encontrado.');
      return;
    }

    try {
      const response = await this.userService.getUserDetails(userId).toPromise();

      const usuario = response?.object?.usuario;
      if (!usuario) {
        this.presentAlert('Erro', 'Dados do usuário não encontrados.');
        return;
      }

      const modal = await this.modalController.create({
        component: UserFormModalComponent,
        componentProps: {
          fields: [
            { name: 'nome', label: 'Nome', type: 'nome', value: usuario.nome ?? '', required: true },
            { name: 'cpf', label: 'CPF', type: 'cpf', value: usuario.cpf ?? '', required: true, mask: '000.000.000-00' },
            { name: 'dataNascimento', label: 'dataNascimento', type: 'date', value: usuario.dataNascimento ?? '', required: false },
            { name: 'email', label: 'Email', type: 'email', value: usuario.email ?? '', required: false },
            { name: 'telefone', label: 'Telefone', type: 'telefone', value: usuario.telefone ?? '', required: false },
            { name: 'username', label: 'Username', type: 'text', value: usuario.username ?? '', required: false },
            { name: 'password', label: 'Senha', type: 'password', value: '********', required: false },
            { name: 'repeatPassword', label: 'Repetir senha', type: 'password', value: '********', required: false }
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

    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      this.presentAlert('Erro', 'Erro ao carregar dados do usuário.');
    }
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
