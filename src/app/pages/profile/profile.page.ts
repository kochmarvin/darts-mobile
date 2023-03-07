import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';
import { Database } from 'src/app/types/Schema';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public profile: Database['public']['Tables']['profiles']['Row'] | null = null;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const { data, error } = await this.supabaseService.supabase
      .from('profiles')
      .select('*')
      .eq('id', this.supabaseService.user?.id).single();

      if(error) {
        return;
      }

      this.profile = data;

      console.log(data);
  }
}
