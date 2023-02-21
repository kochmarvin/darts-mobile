import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, MenuController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private routerOutlet: IonRouterOutlet,
    private menuController: MenuController
  ) {
    this.routerOutlet.swipeGesture = false;
    this.menuController.enable(true);
  }

  ngOnInit() {}

  public async joinRunningGame() {
    const session = await this.supabaseService.session();

    const { data: rooms } = await this.supabaseService
      .getSupabase()
      .from('games')
      .select(
        `
      id,
      running,
      game_players(
        *
      )
    `
      )
      .eq('game_players.profile_id', session?.user.id)
      .eq('running', true);

    const room = rooms?.find((element) => element.game_players.length > 0);

    if (!room) {
      //throw alert
      return;
    }

    this.router.navigateByUrl(`/calculator/${room.id}`);
  }
}
