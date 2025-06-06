import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FooterComponent } from '@/layout/footer';
import { UserService } from '@/services';
import { Router, RouterLink } from '@angular/router';
import { finalize, mergeMap, of } from 'rxjs';
import { WhatsappComponent } from '../../web';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FooterComponent, RouterLink, WhatsappComponent],
  templateUrl: './login.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  public readonly showPassword = signal(false);

  public readonly loanding = signal(false);

  constructor(
    public _fb: FormBuilder,
    public readonly userService: UserService,
    private router: Router,
  ) {}

  public readonly form = this._fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  public togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  onCopy(event: ClipboardEvent): void {
    event.preventDefault();
  }

  onUsernameInput(event: any): void {
    const inputValue = event.target.value;

    const newValue = inputValue.replace(/[^0-9]/g, '');

    event.target.value = newValue;

    this.form.controls.username.setValue(newValue);
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
          this.router.navigate([`/${this.userService.getPermissions()[0].urlSegment}/inicio`]);
        }
      });
  }
}
