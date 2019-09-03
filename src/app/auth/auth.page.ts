import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from './auth.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AlertController, LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy {

    form: FormGroup;
    private sub: Subscription;
    errorMessages = {
        email: [
            {type: 'required', message: 'Email is required.'},
            {type: 'email', message: 'Your email must contain @ symbol and domain.'}
        ],
        password: [
            {type: 'required', message: 'Password is required.'},
            {type: 'minlength', message: 'Password must be at least 6 characters long.'}
        ]
    };

    constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController,
                private alertCtrl: AlertController) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
            password: new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]})
        });
    }

    onLogIn() {
        this.loadingCtrl.create({
            keyboardClose: true,
            spinner: 'bubbles'
        }).then(lcel => {
            lcel.present().then(() => {
                this.sub = this.authService
                    .logInUser(this.form.get('email').value, this.form.get('password').value)
                    .subscribe(
                        () => {
                            lcel.dismiss().then(() => this.router.navigateByUrl('/reminders'));
                        },
                        error => {
                            console.log(error.error.error.message);
                            lcel.dismiss().then(() => this.showErrorMessage(error.error.error.message));
                        }
                    );
            });
        });
    }

    private showErrorMessage(errorMessage: string) {
        const errors = [
            {
                key: 'EMAIL_NOT_FOUND',
                header: 'Email not found',
                message: 'There is no user record corresponding to this identifier. The user may have been deleted.'
            },
            {
                key: 'INVALID_PASSWORD',
                header: 'Invalid password',
                message: 'The password is invalid or the user does not have a password.'
            },
            {
                key: 'USER_DISABLED',
                header: 'User disabled',
                message: 'The user account has been disabled by an administrator.'
            }
        ];

        this.alertCtrl.create({
            header: 'ERROR',
            mode: 'ios',
            cssClass: 'alert-global',
            subHeader: errors.filter(error => error.key === errorMessage)[0].header,
            message: errors.filter(error => error.key === errorMessage)[0].message,
            buttons: [
                {
                    text: 'OK',
                }
            ]
        }).then(ctrl => {
            ctrl.present();
        });
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
