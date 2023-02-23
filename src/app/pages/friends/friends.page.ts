import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements AfterViewInit {
  @ViewChild('barCanvas')
  private barCanvas!: ElementRef;

  @ViewChild('winChart')
  private winCharts!: ElementRef;

  barChart: any;
  winChart: any;

  constructor() {}

  ngAfterViewInit(): void {
    this.barChartMethod();
    this.initWinChart();
  }

  private initWinChart() {
    this.winChart = new Chart(this.winCharts?.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Wins', 'Losses'],
        datasets: [
          {
            data: [300, 50],
            backgroundColor: ['#17CB49', '#F74141'],
            hoverBorderWidth: 2,
            borderWidth: 0,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        clip: false,
        layout: {
          padding: {
            bottom: 10,
            top: 10,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'center',
          },
        },
        animation: false,
        animations: {
          colors: false,
          x: false,
        },
        transitions: {
          active: {
            animation: {
              duration: 0,
            },
          },
        },
      },
    });
  }

  barChartMethod() {
    
    const weeks = ['week 07', 'week 08', 'last week','this week']

    this.barChart = new Chart(this.barCanvas?.nativeElement, {
      type: 'bar',
      data: {
        labels: weeks,
        datasets: [
          {
            label: 'Average',
            data: [50, 45, 65, 70],
            backgroundColor: [
              '#00BA34',
              '#F98600',
              '#E92C2C',
              '#0084FF',
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        clip: false,
        layout: {
          padding: {
            bottom: 10,
            top: 10,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'center',
          },
        },
        animation: false,
        animations: {
          colors: false,
          x: false,
        },
        transitions: {
          active: {
            animation: {
              duration: 0,
            },
          },
        },
      },
    });
  }
}
