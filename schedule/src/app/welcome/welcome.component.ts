import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class WelcomeComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      const token = localStorage.getItem('jwtTokenSchedule');
      if (token) {
        this.router.navigate(['/initial']);
      } else {
        this.router.navigate(['/login']);
      }
    }, 2000);
  }
}
