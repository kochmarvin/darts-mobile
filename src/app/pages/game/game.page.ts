import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import { Database } from 'src/app/types/Schema';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  public game = {
    type: 'Online',
    points: 501,
    mode: 'double',
    legs: 1,
  };

  public loading: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {}

  private createRoomId(length: number) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < length) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		return result;
	};

  public async createGame(): Promise<void> {
    this.loading = true;
    const { data: room } = (await this.supabaseService.supabase
      .from('games')
      .insert({
        game_type: this.game.type.replace('Online', environment.onlne_match_id),
        starting_points: this.game.points,
        legs: this.game.legs,
      })
      .select()
      .single()) as { data: Database['public']['Tables']['games']['Row'] };

    if (!room) {
      const toast = await this.toastController.create({
        message: 'An error occured, try again.',
        duration: 2000,
        icon: 'alert-circle',
        position: 'bottom',
        color: 'danger',
      });

      return await toast.present();
    }

    await this.supabaseService.supabase.from('game_keys').insert({
      id: room.id,
			key: this.createRoomId(6)
    });

    const { error } = await this.supabaseService.supabase
      .from('game_players')
      .insert({
        game_id: room.id,
        profile_id: this.supabaseService.user?.id,
      });

    if (error) {
      const toast = await this.toastController.create({
        message: 'You are already in a room.',
        duration: 2000,
        icon: 'alert-circle',
        position: 'bottom',
        color: 'danger',
      });

      return await toast.present();
    }

    this.loading = false;
    this.router.navigateByUrl(`/calculator/${room.id}`);
  }
}
