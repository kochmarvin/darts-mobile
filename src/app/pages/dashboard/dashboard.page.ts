import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, MenuController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import Chart from 'chart.js/auto';
import { Database } from 'src/app/types/Schema';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, AfterViewInit {
  @ViewChild('barCanvas')
  private barCanvas!: ElementRef;

  @ViewChild('winChart')
  private winCharts!: ElementRef;

  barChart: any;
  winChart: any;

  public profile: Database['public']['Tables']['profiles']['Row'] | null = null;
  public statistics:
    | Database['public']['Tables']['profile_statistics']['Row'][]
    | null = null;

  constructor(
    public supabaseService: SupabaseService,
    private router: Router,
    private routerOutlet: IonRouterOutlet,
    private menuController: MenuController
  ) {
    this.routerOutlet.swipeGesture = false;
    this.menuController.enable(true);
  }

  async ngAfterViewInit(): Promise<void> {
    const { data: profile } = await this.supabaseService.supabase
      .from('profiles')
      .select('*')
      .eq('id', this.supabaseService.user?.id)
      .single();

    this.profile = profile;

    const date = new Date();
    date.setMonth(date.getMonth() - 1);

    const { data } = await this.supabaseService.supabase
      .from('profile_statistics')
      .select('*')
      .eq('id', this.supabaseService.user?.id)
      .gte('created_at', date.toISOString())
      .order('created_at', {
        ascending: false,
      });

    this.statistics = data;

    this.initWinChart();
    this.initAverageChart();
  }

  async ngOnInit() {}

  private initWinChart() {
    if (!this.profile) {
      return;
    }

    this.winChart = new Chart(this.winCharts?.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Wins', 'Losses'],
        datasets: [
          {
            data: [this.profile.wins, this.profile.losses],
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

  private initAverageChart() {
    const weeks = ['week 07', 'week 08', 'last week', 'this week'];

    if (!this.statistics) {
      return;
    }

    const data = this.statistics.map((ele) => {
      return ele.total_score / ele.total_throws;
    }).reverse();

    weeks.splice(0, 4 - this.statistics.length);

    this.barChart = new Chart(this.barCanvas?.nativeElement, {
      type: 'bar',
      data: {
        labels: weeks,
        datasets: [
          {
            label: 'Average',
            data,
            backgroundColor: ['#00BA34', '#F98600', '#E92C2C', '#0084FF'],
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
