import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from './auth.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy {

    form: FormGroup;
    private sub: Subscription;

    constructor(private authService: AuthService, private router: Router) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
            password: new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]})
        });
    }

    onLogIn() {
        this.sub = this.authService
            .logInUser(this.form.get('email').value, this.form.get('password').value)
            .subscribe(
                authResponseData => {
                    console.log(authResponseData);
                    this.router.navigateByUrl('/reminders');
                },
                error => {
                    console.log(error.error.error.message);
                }
            );
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
