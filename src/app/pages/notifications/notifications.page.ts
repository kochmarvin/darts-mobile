import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  public notifications: any[] = [];

  constructor(
    private supabaseService: SupabaseService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.fetchNotifications();
  }

  private async fetchNotifications() {
    const { data } = await this.supabaseService.supabase
      .from('friend_requests')
      .select('from_profile_id(*)')
      .eq('to_profile_id', this.supabaseService.user?.id);

    if (data) {
      this.notifications = data;
    }
  }

  public async acceptFriendRequest(from: string) {
    const { error } = await this.supabaseService.supabase
      .from('friends')
      .insert({
        first_profile_id: this.supabaseService.user?.id,
        second_profile_id: from,
      });

    if (!error) {
      const toast = await this.toastController.create({
        message: 'Friend request accepted.',
        duration: 2000,
        icon: 'information-circle',
        position: 'bottom',
        color: 'success',
      });

      const index = this.notifications.indexOf(
        (element: any) => element.from_profile_id.id === from
      );

      this.notifications.splice(index, 1);

      return await toast.present();
    }

    const toast = await this.toastController.create({
      message: 'An error occured, try again.',
      duration: 2000,
      icon: 'alert-circle',
      position: 'bottom',
      color: 'danger',
    });

    return await toast.present();
  }

  public async declineFriendRequest(from: string) {
    const { error } = await this.supabaseService.supabase
      .from('friend_requests')
      .delete()
      .eq('to_profile_id', this.supabaseService.user?.id);

    if (!error) {
      const toast = await this.toastController.create({
        message: 'Friend request declined.',
        duration: 2000,
        icon: 'information-circle',
        position: 'bottom',
        color: 'success',
      });

      const index = this.notifications.indexOf(
        (element: any) => element.from_profile_id.id === from
      );

      this.notifications.splice(index, 1);

      return await toast.present();
    }

    const toast = await this.toastController.create({
      message: 'An error occured, try again.',
      duration: 2000,
      icon: 'alert-circle',
      position: 'bottom',
      color: 'danger',
    });

    return await toast.present();
  }
}
