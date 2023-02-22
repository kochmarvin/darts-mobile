import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonRouterOutlet, MenuController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public errorMessage: string | undefined;
  public logginIn: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private fb: FormBuilder,
    private router: Router,
    private menuController: MenuController,
    private routerOutlet: IonRouterOutlet
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.menuController.enable(false);
    this.routerOutlet.swipeGesture = false;
  }

  ngOnInit() {
    if (this.supabaseService.session != null) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  public async login($event: any) {
    this.logginIn = true;
    const { data, error } = await this.supabaseService.signIn(
      this.loginForm.controls['email'].value,
      this.loginForm.controls['password'].value
    );

    console.log(this.loginForm.controls['email'].value);

    if (!error) {
      this.router.navigateByUrl('/dashboard');
      this.supabaseService.setSession();
      this.supabaseService.setUser();
    }

    this.errorMessage = `Error: ${error?.message}`;
    this.logginIn = false;
  }
}
