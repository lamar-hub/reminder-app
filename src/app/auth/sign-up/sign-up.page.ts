import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.page.html',
    styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

    form: FormGroup;

    constructor(private navCtrl: NavController) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            email: new FormControl(null, {updateOn: 'change', validators: [Validators.required, Validators.email]}),
            password: new FormControl(null, {updateOn: 'change', validators: [Validators.required, Validators.minLength(6)]}),
            confirmPassword: new FormControl(null, {updateOn: 'change', validators: [Validators.required, Validators.minLength(6)]})
        }, {updateOn: 'change', validators: [this.confirmPasswordValidator]});
    }

    onSignUp() {
        this.navCtrl.pop();
    }

    private confirmPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
        if (control.get('password').value !== control.get('confirmPassword').value) {
            return {samePassword: true};
        }
        return null;
    }

}
