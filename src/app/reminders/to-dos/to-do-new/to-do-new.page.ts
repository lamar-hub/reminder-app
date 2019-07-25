import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-to-do-new',
    templateUrl: './to-do-new.page.html',
    styleUrls: ['./to-do-new.page.scss'],
})
export class ToDoNewPage implements OnInit {
    form: FormGroup;

    constructor(private navCtrl: NavController) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, {updateOn: 'change', validators: [Validators.required]})
        });
    }

    onCreateToDo() {
        this.navCtrl.pop();
    }
}
