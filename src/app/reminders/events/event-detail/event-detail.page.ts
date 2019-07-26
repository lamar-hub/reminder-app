import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventService} from '../event.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Event} from '../event.model';

@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.page.html',
    styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit, OnDestroy {

    event: Event;
    private sub: Subscription;

    constructor(private eventService: EventService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            this.sub = this.eventService.getEvent(paramMap.get('eventId')).subscribe(event => {
                this.event = event;
            });
        });
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

}
