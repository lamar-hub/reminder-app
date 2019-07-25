import {Component, OnInit} from '@angular/core';
import {Event} from './event.model';
import {IonItemSliding} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

    events: Event[] = [
        new Event('123', 'Svadba', 'Kupi pokolon', new Date(), new Date(), new Date(), 'Krezbinac'),
        new Event('124', 'Krstenje', 'Kupi pokolon', new Date(), new Date(), new Date(), 'Paracin'),
        new Event('125', 'Rodjendan', 'Kupi pokolon', new Date(), new Date(), new Date(), 'Beograd'),
    ];

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    onEditEvent(id: string, slider: IonItemSliding) {
        slider.closeOpened();
        this.router.navigate(['/', 'reminders', 'tabs', 'events', 'edit', id]);
    }

    onDeleteEvent(id: string, slider: IonItemSliding) {
        slider.closeOpened();
    }
}
