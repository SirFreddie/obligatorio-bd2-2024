import { Component, OnInit, inject } from '@angular/core';
import { IUser } from '../../../../core/models/interfaces/IUser.interface';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
})
export default class LeaderboardComponent implements OnInit {
  users: IUser[] = [];

  apiService: ApiService = inject(ApiService);

  ngOnInit() {
    this.apiService.getUserPoints().subscribe({
      next: users => {
        this.users = users;
        this.users.sort((a, b) => b.points - a.points);
      },
    });
  }
}
