import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-event-new',
    templateUrl: './event-new.page.html',
    styleUrls: ['./event-new.page.scss'],
})
export class EventNewPage implements OnInit {

    constructor(private navCtrl: NavController) {
    }

    ngOnInit() {
    }

    onCreateEvent() {
        this.navCtrl.pop();
    }
}
