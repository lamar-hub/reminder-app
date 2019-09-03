import {Component, OnDestroy, OnInit} from '@angular/core';
import {Event} from './event.model';
import {ActionSheetController, IonItemSliding, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {EventService} from './event.service';
import {Subscription} from 'rxjs';
import {AccountComponent} from '../account/account.component';
import {ImageService} from '../account/image.service';
import {SafeResourceUrl} from '@angular/platform-browser';

@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, OnDestroy {

    loading = true;
    events: Event[] = [];
    pastEvents: Event[] = [];
    todayEvents: Event[] = [];
    imageUrl: SafeResourceUrl;
    private sub: Subscription;
    private sub2: Subscription;
    private sub3: Subscription;

    constructor(private router: Router,
                private eventService: EventService,
                private modalCtrl: ModalController,
                private actionSheetCtrl: ActionSheetController,
                private imageService: ImageService) {
    }

    ngOnInit() {
        this.sub = this.eventService.eventsObservable.subscribe(events => {
            this.events = events
                .filter(evt => new Date(evt.date).getTime() - new Date().setHours(0, 0, 0, 0) > 86400000)
                .sort((evt1, evt2) => new Date(evt1.date).getTime() - new Date(evt2.date).getTime());
            this.todayEvents = events
                .filter(evt => {
                    const number = new Date(evt.date).getTime() - new Date().setHours(0, 0, 0, 0);
                    return number > 0 && number < 86400000;
                });
            this.pastEvents = events
                .filter(evt => new Date(evt.date).getTime() < new Date().setHours(0, 0, 0, 0));
        });
        this.sub3 = this.imageService.imageUrlObservable.subscribe(url => {
            this.imageUrl = url;
        });
    }

    ionViewWillEnter() {
        this.loading = true;
        this.eventService.fetchAllEvents().subscribe(() => {
            this.loading = false;
        });
    }

    onEditEvent(id: string, slider: IonItemSliding) {
        slider.closeOpened().then(() => this.router.navigate(['/', 'reminders', 'tabs', 'events', 'edit', id]));
    }

    onDeleteEvent(id: string, slider: IonItemSliding) {
        this.actionSheetCtrl.create({
            header: 'Event',
            subHeader: 'Do you want to delete event?',
            mode: 'ios',
            buttons: [
                {
                    text: 'Delete',
                    handler: () => {
                        this.loading = true;
                        slider.closeOpened().then(() => this.sub2 =
                            this.eventService.deleteEvent(id).subscribe(() => this.loading = false));
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        }).then(asel => {
            asel.present();
        });
    }

    openAccount() {
        this.modalCtrl
            .create(
                {
                    component: AccountComponent,
                }
            )
            .then(modalEl => {
                modalEl.present();
            });
    }

    onDeleteAllPastEvents() {
        this.actionSheetCtrl.create({
            header: 'Events',
            subHeader: 'Do you want to delete all past events?',
            mode: 'ios',
            buttons: [
                {
                    text: 'Delete ALL',
                    handler: () => {
                        this.loading = true;
                        this.eventService.deleteAllPastEvents(this.pastEvents.map(evt => evt.id)).subscribe(() => this.loading = false);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        }).then(asel => {
            asel.present();
        });

    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        if (this.sub2) {
            this.sub2.unsubscribe();
        }
        if (this.sub3) {
            this.sub3.unsubscribe();
        }
    }

}
