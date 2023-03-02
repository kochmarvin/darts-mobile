import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonRouterOutlet,
  ToastController,
} from '@ionic/angular';
import { SupabaseService } from './services/supabase/supabase.service';
import { Database } from './types/Schema';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'home' },
    { title: 'Friends', url: '/friends', icon: 'people' },
    { title: 'Profile', url: '/profile', icon: 'person' },
  ];

  public notificatonCount: number = 0;

  constructor(
    public supabaseService: SupabaseService,
    public router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async ngOnInit(): Promise<void> {
    await this.supabaseService.setSession();
    await this.supabaseService.setUser();

    if (
      !this.supabaseService.session ||
      !this.supabaseService.user ||
      !this.supabaseService.supabase
    ) {
      return;
    }

    const { data: notifications } = await this.supabaseService.supabase
      .from('friend_requests')
      .select('from_profile_id')
      .eq('to_profile_id', this.supabaseService.user.id);

    if (notifications) {
      this.notificatonCount = notifications.length;
    }

    const { data } = await this.supabaseService.supabase
      .from('games')
      .select('id,game_players(*)')
      .eq('game_players.profile_id', this.supabaseService.user?.id)
      .eq('running', true)
      .single();

    if (!data) {
      return;
    }

    const alert = await this.alertController.create({
      header: '🎯 Ooops...',
      message: 'You have a running game',
      buttons: [
        {
          text: 'Nope',
          role: 'cancel',
        },

        {
          text: 'Join!',
          role: 'confirm',
          handler: () => {
            this.router.navigateByUrl(`/calculator/${data.id}`);
          },
        },
      ],
    });

    await alert.present();
  }

  public async showJoinGameAlert() {
    const alert = await this.alertController.create({
      header: 'Please enter the room Key',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Join',
          role: 'confirm',
        },
      ],
      inputs: [
        {
          placeholder: 'Room Key',
          attributes: {
            maxlength: 6,
          },
        },
      ],
    });

    await alert.present();
    const { data, role } = await alert.onDidDismiss();

    if (role === 'confirm') {
      console.log(data.values[0]);

      const { data: room } = await this.supabaseService.supabase
        .from('game_keys')
        .select('*')
        .eq('key', data.values[0])
        .single();

      if (!room) {
        const toast = await this.toastController.create({
          message: 'There is no room with this key.',
          duration: 2000,
          icon: 'alert-circle',
          position: 'bottom',
          color: 'danger',
        });

        return await toast.present();
      }

      const { error } = await this.supabaseService.supabase
        .from('game_players')
        .insert({
          game_id: room.id,
          profile_id: this.supabaseService.user?.id,
        });

      if (error) {
        const toast = await this.toastController.create({
          message: 'The room is already full',
          duration: 2000,
          icon: 'alert-circle',
          position: 'bottom',
          color: 'danger',
        });

        return await toast.present();
      }

      this.router.navigateByUrl(`/calculator/${room.id}`);
    }
  }

  public async logOut() {
    const { error } = await this.supabaseService.signOut();

    if (!error) {
      this.router.navigateByUrl('/login');
    }
  }
}
