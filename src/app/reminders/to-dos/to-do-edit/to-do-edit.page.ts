import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-to-do-edit',
    templateUrl: './to-do-edit.page.html',
    styleUrls: ['./to-do-edit.page.scss'],
})
export class ToDoEditPage implements OnInit {

    constructor(private navCtrl: NavController) {
    }

    ngOnInit() {
    }

    onEditToDo() {
        this.navCtrl.pop();
    }
}
