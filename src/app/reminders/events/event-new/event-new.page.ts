import {Component, OnInit} from '@angular/core';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventService} from '../event.service';
import {PlaceLocation} from '../location.model';
import {MapModalComponent} from '../../../shared/map-modal/map-modal.component';
import {switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {Plugins} from '@capacitor/core';

const {Geolocation} = Plugins;

@Component({
    selector: 'app-event-new',
    templateUrl: './event-new.page.html',
    styleUrls: ['./event-new.page.scss'],
})
export class EventNewPage implements OnInit {

    form: FormGroup;
    selectedLocationImage: string;

    constructor(private navCtrl: NavController, private eventService: EventService, private modalCtrl: ModalController,
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
    }

    onCreateEvent() {
        this.navCtrl.pop();
        this.eventService.coords = null;

        this.eventService.addEvent(
            this.form.get('title').value,
            this.form.get('date').value,
            this.form.get('time.beginTime').value,
            this.form.get('time.endTime').value,
            this.form.get('location').value,
            this.form.get('notes').value).subscribe();
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
            component: MapModalComponent,
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
                this.eventService
                    .getAddress(modalData.data.lat, modalData.data.lng)
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
        if (!Geolocation) {
            return;
        }
        Geolocation
            .getCurrentPosition()
            .then((position: Position) => {
                console.log(position);
                this.eventService.coords = {lat: position.coords.latitude, lng: position.coords.longitude};
                const pickedLocation: PlaceLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    address: null,
                    staticMapImageUrl: null
                };
                console.log('Location', pickedLocation);
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
}
