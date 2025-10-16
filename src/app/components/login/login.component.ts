import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '@/services';
import { Router, RouterLink } from '@angular/router';
import { finalize, mergeMap, of } from 'rxjs';
import { LoadingRedirectService } from '../../shared/services/loading-redirect.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  public readonly showPassword = signal(false);

  public readonly loanding = signal(false);
  private loadingService = inject(LoadingRedirectService);
  private _fb = inject(FormBuilder);
  private userService = inject(UserService);

  constructor(
  ) {}

  public readonly form = this._fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  public togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }



  public submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const login = {
      username: this.form.controls.username.value,
      password: this.form.controls.password.value,
    };

    of(this.loanding.set(true))
      .pipe(
        mergeMap(() => this.userService.login(login)),
        finalize(() => this.loanding.set(false)),
      )
      .subscribe((response) => {
        if (response.status === 'OK') {
          const permissions = this.userService.getPermissions();
          console.log('Permissions:', permissions);
          if (permissions && permissions.length > 0) {
            console.log('Redirecting to:', `/${permissions[0].urlSegment}/inicio`);
            this.loadingService.show(`/${permissions[0].urlSegment}/inicio`);
          } else {
            console.log('No permissions, redirecting to default');
            this.loadingService.show('/sistema_dental/inicio');
          }
        }
      });
  }
}
