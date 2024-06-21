import { Component, OnInit, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.scss',
})
export class InsightsComponent implements OnInit {
  apiService: ApiService = inject(ApiService);

  basicData: any;
  basicOptions: any;

  statistics: any;

  ngOnInit() {
    this.apiService.getStatistics().subscribe({
      next: data => {
        this.statistics = data.statistics;
        this.setChartDataset();
      },
      error: error => {
        console.error(error);
      },
    });
  }

  setChartDataset() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicData = {
      labels: this.statistics.map((stat: any) => stat.career_name),
      datasets: [
        {
          label: 'Porcentaje de aciertos',
          data: this.statistics.map((stat: any) => stat.accuracy_percentage),
        },
      ],
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
}
