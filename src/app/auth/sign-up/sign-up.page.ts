import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
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

    constructor(private navCtrl: NavController, private authService: AuthService) {
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
                    {updateOn: 'change', validators: [Validators.required, Validators.minLength(6)]}
                )
            },
            {updateOn: 'change', validators: [this.confirmPasswordValidator]}
        );
    }

    onSignUp() {
        this.sub = this.authService
            .signUpUser(this.form.get('email').value, this.form.get('password').value)
            .subscribe(
                authResponseData => {
                    console.log(authResponseData);
                    this.navCtrl.pop();
                },
                error => {
                    if (error.error.error.message === 'EMAIL_EXISTS') {
                        console.log('Email already exist');
                    }
                }
            );
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
