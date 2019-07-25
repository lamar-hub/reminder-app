import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-to-do-edit',
    templateUrl: './to-do-edit.page.html',
    styleUrls: ['./to-do-edit.page.scss'],
})
export class ToDoEditPage implements OnInit {

    form: FormGroup;

    constructor(private navCtrl: NavController) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, {updateOn: 'change', validators: [Validators.required]})
        });
    }

    onEditToDo() {
        this.navCtrl.pop();
    }
}
