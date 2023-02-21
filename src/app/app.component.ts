import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { SupabaseService } from './services/supabase/supabase.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [{ title: 'Dashboard', url: '/dashboard', icon: 'home' }, { title: 'H', url: '/folder/a', icon: 'home' }];

  constructor(
    public supabaseService: SupabaseService,
    public router: Router,
  ) {
  }

  public async logOut() {
    const { error } = await this.supabaseService.signOut();

    if (!error) {
      this.router.navigateByUrl('/login');
    }
  }
}
