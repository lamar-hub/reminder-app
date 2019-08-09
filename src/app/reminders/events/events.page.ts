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
            this.events = events;
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
                    role: 'destructive'
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
