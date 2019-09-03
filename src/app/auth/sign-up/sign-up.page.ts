import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertController, NavController} from '@ionic/angular';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.page.html',
    styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit, OnDestroy {

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
        ],
        confirmPassword: [
            {type: 'samePassword', message: 'Password mismatch.'}
        ]
    };

    constructor(private navCtrl: NavController, private authService: AuthService, private alertCtrl: AlertController) {
    }

    ngOnInit() {
        this.form = new FormGroup(
            {
                email: new FormControl(
                    null,
                    {updateOn: 'change', validators: [Validators.required, Validators.email]}
                ),
                password: new FormControl(
                    null,
                    {updateOn: 'change', validators: [Validators.required, Validators.minLength(6)]}
                ),
                confirmPassword: new FormControl(
                    null,
                    {updateOn: 'change'}
                )
            },
            {updateOn: 'change', validators: [this.confirmPasswordValidator]}
        );
    }

    onSignUp() {
        if (!this.form.valid) {
            return;
        }
        this.sub = this.authService
            .signUpUser(this.form.get('email').value, this.form.get('password').value)
            .subscribe(
                authResponseData => {
                    console.log(authResponseData);
                    this.navCtrl.pop();
                },
                error => {
                    this.showErrorMessage(error.error.error.message);
                }
            );
    }

    private showErrorMessage(errorMessage: string) {
        const errors = [
            {
                key: 'EMAIL_EXISTS',
                header: 'Email already exists',
                message: 'The email address is already in use by another account.'
            },
            {
                key: 'OPERATION_NOT_ALLOWED',
                header: 'Operation not allowed',
                message: 'Password sign-in is disabled for this project.'
            },
            {
                key: 'TOO_MANY_ATTEMPTS_TRY_LATER',
                header: 'Try again later',
                message: 'We have blocked all requests from this device due to unusual activity. Try again later.'
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
                    text: 'OK'
                }
            ]
        }).then(ctrl => {
            ctrl.present();
        });
    }

    private confirmPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
        if (control.get('password').value !== control.get('confirmPassword').value) {
            return {samePassword: true};
        }
        return null;
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

}
