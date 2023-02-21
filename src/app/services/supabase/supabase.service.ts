import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import {
  SupabaseClient,
  createClient,
  AuthChangeEvent,
  Session,
  AuthResponse,
  AuthError,
  UserResponse,
  User,
} from '@supabase/supabase-js';
import { Database } from 'src/app/types/Schema';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.supabase = createClient<Database>(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  public getSupabase() {
    return this.supabase;
  }

  public async getUser(): Promise<User | null> {
    return (await this.supabase.auth.getUser()).data.user;
  }

  public async session(): Promise<Session | null> {
    return (await this.supabase.auth.getSession()).data.session;
  }

  public signIn(email: string, password: string): Promise<AuthResponse> {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  public signOut(): Promise<{
    error: AuthError | null;
  }> {
    return this.supabase.auth.signOut();
  }
}
