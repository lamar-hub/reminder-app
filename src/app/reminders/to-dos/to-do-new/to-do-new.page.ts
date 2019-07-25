import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-to-do-new',
    templateUrl: './to-do-new.page.html',
    styleUrls: ['./to-do-new.page.scss'],
})
export class ToDoNewPage implements OnInit {

    constructor(private navCtrl: NavController) {
    }

    ngOnInit() {
    }

    onCreateToDo() {
        this.navCtrl.pop();
    }
}
