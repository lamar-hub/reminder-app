import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventService} from '../event.service';
import {PlaceLocation} from '../location.model';
import {MapModalComponent} from '../../../shared/map-modal/map-modal.component';
import {switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {Plugins} from '@capacitor/core';

@Component({
    selector: 'app-event-new',
    templateUrl: './event-new.page.html',
    styleUrls: ['./event-new.page.scss'],
})
export class EventNewPage implements OnInit {

    form: FormGroup;
    date = new Date();
    selectedLocationImage: string;

    constructor(private navCtrl: NavController, private eventService: EventService, private modalCtrl: ModalController) {
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

    onPickLocation() {
        this.modalCtrl.create({
            component: MapModalComponent
        }).then(modalEl => {
            modalEl.onDidDismiss().then(modalData => {
                if (!modalData.data) {
                    return;
                }
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
        Plugins.Geolocation
            .getCurrentPosition()
            .then((position: Position) => {
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
}
