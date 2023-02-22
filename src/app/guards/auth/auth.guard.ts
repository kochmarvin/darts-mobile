import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private subapaseService: SupabaseService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    await this.subapaseService.setSession();
    await this.subapaseService.setUser();

    const session = (await this.subapaseService.supabase.auth.getSession()).data
      .session;

    if (session == null) this.router.navigateByUrl('/');
    return session != null;
  }
}
