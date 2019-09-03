import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Event} from '../event.model';
import {of, Subscription} from 'rxjs';
import {EventService} from '../event.service';
import {ActivatedRoute} from '@angular/router';
import {PlaceLocation} from '../location.model';
import {MapModalComponent} from '../../../shared/map-modal/map-modal.component';
import {switchMap, tap} from 'rxjs/operators';
import {Plugins} from '@capacitor/core';

@Component({
    selector: 'app-event-edit',
    templateUrl: './event-edit.page.html',
    styleUrls: ['./event-edit.page.scss'],
})
export class EventEditPage implements OnInit, OnDestroy {

    event: Event;
    form: FormGroup;
    private sub: Subscription;
    private sub2: Subscription;
    selectedLocationImage: string;

    constructor(private navCtrl: NavController,
                private eventService: EventService,
                private route: ActivatedRoute,
                private modalCtrl: ModalController,
                private actionSheetCtrl: ActionSheetController) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, {updateOn: 'change', validators: [Validators.required]}),
            date: new FormControl(null, {updateOn: 'change', validators: [Validators.required]}),
            time: new FormGroup({
                beginTime: new FormControl(null, {updateOn: 'change', validators: [Validators.required]}),
                endTime: new FormControl(null, {updateOn: 'change', validators: [Validators.required]}),
            }, {updateOn: 'change', validators: [this.endTimeValidator]}),
            location: new FormControl(null, {updateOn: 'change'}),
            notes: new FormControl(null, {updateOn: 'change'}),
        });
        this.route.paramMap.subscribe(paramMap => {
            console.log(paramMap.get('eventId'));
            this.sub = this.eventService.getEvent(paramMap.get('eventId')).subscribe(event => {
                this.event = event;
                this.eventService.coords = {lat: event.location.lat, lng: event.location.lng};
                this.selectedLocationImage = this.event.location.staticMapImageUrl;
                this.form.setValue({
                    title: this.event.title,
                    date: this.event.date,
                    time: {
                        beginTime: this.event.beginTime,
                        endTime: this.event.endTime,
                    },
                    location: this.event.location,
                    notes: !!this.event.notes ? this.event.notes : null
                });
            });
        });
    }

    onEditEvent() {
        this.eventService.coords = null;

        this.sub2 = this.eventService.updateEvent(
            this.event.id,
            this.form.get('title').value,
            new Date(this.form.get('date').value),
            new Date(this.form.get('time.beginTime').value),
            new Date(this.form.get('time.endTime').value),
            this.form.get('location').value,
            this.form.get('notes').value).subscribe(() => {
            this.navCtrl.pop();
        });
    }

    endTimeValidator(control: AbstractControl): { [key: string]: boolean } | null {
        if (new Date(control.get('endTime').value) <= new Date(control.get('beginTime').value)) {
            return {dateMin: false};
        }
        return null;
    }

    onLocate() {
        this.actionSheetCtrl.create({
            header: 'Pick location',
            subHeader: 'Choose your location mode!',
            cssClass: 'action-sheet-global',
            mode: 'ios',
            buttons: [
                {
                    text: 'Custom Location',
                    handler: () => this.onPickLocation()
                },
                {
                    text: 'Auto Location',
                    handler: () => this.onAutoLocate()
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        }).then(el => {
            el.present();
        });
    }

    onPickLocation() {
        this.modalCtrl.create({
            component: MapModalComponent
        }).then(modalEl => {
            modalEl.onDidDismiss().then(modalData => {
                if (!modalData.data) {
                    return;
                }
                this.eventService.coords = {lat: modalData.data.lat, lng: modalData.data.lng};
                const pickedLocation: PlaceLocation = {
                    lat: modalData.data.lat,
                    lng: modalData.data.lng,
                    address: null,
                    staticMapImageUrl: null
                };
                this.eventService.getAddress(modalData.data.lat, modalData.data.lng)
                    .pipe(
                        switchMap(address => {
                            pickedLocation.address = address;
                            return of(this.eventService.getAppImage(pickedLocation.lat, pickedLocation.lng, 14));
                        }),
                        tap(staticMapUrl => {
                            pickedLocation.staticMapImageUrl = staticMapUrl;
                            this.selectedLocationImage = staticMapUrl;
                            this.form.patchValue({
                                location: pickedLocation
                            });
                        })
                    )
                    .subscribe();
            });
            modalEl.present();
        });
    }

    onAutoLocate() {
        if (!Plugins.Geolocation) {
            console.log('false');
            return;
        }

        Plugins.Geolocation
            .getCurrentPosition()
            .then((position: Position) => {
                this.eventService.coords = {lat: position.coords.latitude, lng: position.coords.longitude};
                const pickedLocation: PlaceLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    address: null,
                    staticMapImageUrl: null
                };
                this.eventService
                    .getAddress(position.coords.latitude, position.coords.longitude)
                    .pipe(
                        switchMap(address => {
                            pickedLocation.address = address;
                            return of(this.eventService.getAppImage(pickedLocation.lat, pickedLocation.lng, 14));
                        }),
                        tap(staticMapUrl => {
                            pickedLocation.staticMapImageUrl = staticMapUrl;
                            this.selectedLocationImage = staticMapUrl;
                            this.form.patchValue({
                                location: pickedLocation
                            });
                        })
                    )
                    .subscribe();
            })
            .catch(reason => {
                console.log(reason);
            });
    }

    ionViewWillLeave() {
        this.eventService.coords = null;
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        if (this.sub2) {
            this.sub2.unsubscribe();
        }
    }

}
