import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

    form: FormGroup;

    constructor() {
    }

    ngOnInit() {
        this.form = new FormGroup({
            email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
            password: new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]})
        });
    }

}
