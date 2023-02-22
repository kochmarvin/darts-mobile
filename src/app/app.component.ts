import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonRouterOutlet } from '@ionic/angular';
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
    { title: 'Game', url: '/game', icon: 'game-controller' },
    { title: 'Friends', url: '/friends', icon: 'people' },
    { title: 'Profile', url: '/profile', icon: 'person' },
  ];

  constructor(
    public supabaseService: SupabaseService,
    public router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit(): Promise<void> {
    await this.supabaseService.setSession();
    await this.supabaseService.setUser();

    if (!this.supabaseService.session) {
      return;
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

  public async logOut() {
    const { error } = await this.supabaseService.signOut();

    if (!error) {
      this.router.navigateByUrl('/login');
    }
  }
}
