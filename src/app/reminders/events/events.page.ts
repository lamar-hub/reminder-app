import {Component, OnDestroy, OnInit} from '@angular/core';
import {Event} from './event.model';
import {IonItemSliding} from '@ionic/angular';
import {Router} from '@angular/router';
import {EventService} from './event.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, OnDestroy {

    events: Event[] = [];
    private sub: Subscription;

    constructor(private router: Router, private eventService: EventService) {
    }

    ngOnInit() {
        this.sub = this.eventService.eventsObservable.subscribe(events => {
            this.events = events;
        });
    }

    ionViewWillEnter() {
        this.eventService.fetchAllEvents().subscribe();
    }

    onEditEvent(id: string, slider: IonItemSliding) {
        slider.closeOpened();
        this.router.navigate(['/', 'reminders', 'tabs', 'events', 'edit', id]);
    }

    onDeleteEvent(id: string, slider: IonItemSliding) {
        slider.closeOpened();
        this.eventService.deleteEvent(id).subscribe();
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
