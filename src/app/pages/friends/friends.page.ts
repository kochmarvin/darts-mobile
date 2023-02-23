import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IonModal, ToastController } from '@ionic/angular';
import { Chart } from 'chart.js/auto';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import { Database } from 'src/app/types/Schema';

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

  @ViewChild(IonModal)
  modal!: IonModal;

  barChart: any;
  winChart: any;

  public friends: Database['public']['Tables']['profiles']['Row'][] = [];
  public foundProfiles: Database['public']['Tables']['profiles']['Row'][] = [];
  public sentFriendRequests: string[] = [];

  constructor(
    private supabaseService: SupabaseService,
    private toastController: ToastController
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.initAverageChart();
    this.initWinChart();

    const { data: sentRequests } = await this.supabaseService.supabase
      .from('friend_requests')
      .select('to_profile_id')
      .eq('from_profile_id', this.supabaseService.user?.id);

    // const { data: friends } = await this.supabaseService.supabase
    //   .from('friends')
    //   .select('').contains();

    if (sentRequests) {
      this.sentFriendRequests = sentRequests.map(
        (request) => request.to_profile_id
      );
    }
  }

  public async addFriend(id: string): Promise<void> {
    const { error } = await this.supabaseService.supabase
      .from('friend_requests')
      .insert({
        from_profile_id: this.supabaseService.user?.id,
        to_profile_id: id,
      });

    if (error) {
      const toast = await this.toastController.create({
        message: 'An error occured, try again.',
        duration: 2000,
        icon: 'alert-circle',
        position: 'bottom',
        color: 'danger',
      });

      return await toast.present();
    }

    const toast = await this.toastController.create({
      message: 'Friend request sent.',
      duration: 2000,
      icon: 'information-circle',
      position: 'bottom',
      color: 'success',
    });

    return await toast.present();
  }

  public async searchProfilesFromDatabase(event: any): Promise<void> {
    const { data: profiles } = await this.supabaseService.supabase
      .from('profiles')
      .select('*')
      .like('nick_name', `${event.detail.value}%`)
      .neq('id', this.supabaseService.user?.id);

    if (!profiles) {
      return;
    }

    this.foundProfiles = profiles;
  }

  public async dismiss(): Promise<void> {
    await this.modal.dismiss();
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

  private initAverageChart() {
    const weeks = ['week 07', 'week 08', 'last week', 'this week'];

    this.barChart = new Chart(this.barCanvas?.nativeElement, {
      type: 'bar',
      data: {
        labels: weeks,
        datasets: [
          {
            label: 'Average',
            data: [50, 45, 65, 70],
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
