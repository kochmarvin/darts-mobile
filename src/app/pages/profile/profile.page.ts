import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import { Database } from 'src/app/types/Schema';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public profile: Database['public']['Tables']['profiles']['Row'] | null = null;
  public profileForm: FormGroup;

  constructor(
    private supabaseService: SupabaseService,
    private fb: FormBuilder,
    private toastController: ToastController
  ) {
    this.profileForm = this.fb.group({
      nickname: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  async ngOnInit() {
    const { data, error } = await this.supabaseService.supabase
      .from('profiles')
      .select('*')
      .eq('id', this.supabaseService.user?.id)
      .single();

    if (error) {
      return;
    }

    this.profile = data;
    this.profileForm.controls['nickname'].setValue(this.profile?.nick_name);
    this.profileForm.controls['firstname'].setValue(this.profile?.first_name);
    this.profileForm.controls['lastname'].setValue(this.profile?.last_name);

    this.profileForm.controls['email'].setValue(
      this.supabaseService.user?.email
    );
  }

  public async update(event: any): Promise<void> {
    const { error } = await this.supabaseService.supabase
      .from('profiles')
      .upsert({
        id: this.supabaseService.user?.id,
        last_name: this.profileForm.controls['lastname'].value,
        first_name: this.profileForm.controls['firstname'].value,
        nick_name: this.profileForm.controls['nickname'].value,
      })
      .eq('id', this.supabaseService.user?.id);

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

    if (
      this.supabaseService.user?.email !==
      this.profileForm.controls['email'].value
    ) {
      await this.supabaseService.supabase.auth.updateUser({
        email: this.profileForm.controls['email'].value,
      });
    }

    const toast = await this.toastController.create({
      message: 'Profile updated.',
      duration: 2000,
      icon: 'information-circle',
      position: 'bottom',
      color: 'success',
    });

    return await toast.present();
  }
}
