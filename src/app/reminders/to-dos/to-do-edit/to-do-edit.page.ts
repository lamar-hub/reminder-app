import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToDo} from '../to-do.model';

@Component({
    selector: 'app-to-do-edit',
    templateUrl: './to-do-edit.page.html',
    styleUrls: ['./to-do-edit.page.scss'],
})
export class ToDoEditPage implements OnInit {

    toDo: ToDo = new ToDo('123', 'Opleti', true);
    form: FormGroup;

    constructor(private navCtrl: NavController) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(this.toDo.title, {updateOn: 'change', validators: [Validators.required]})
        });
    }

    onEditToDo() {
        this.navCtrl.pop();
    }
}
