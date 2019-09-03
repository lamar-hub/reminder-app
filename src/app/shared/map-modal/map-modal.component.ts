import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {environment} from '../../../environments/environment';
import {EventService} from '../../reminders/events/event.service';

@Component({
    selector: 'app-map-modal',
    templateUrl: './map-modal.component.html',
    styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('map') mapElementRef: ElementRef;
    clickListener: any;
    googleMaps: any;

    constructor(private modalCtrl: ModalController, private renderer: Renderer2, private eventService: EventService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.getGoogleMaps().then(googleMaps => {
            this.googleMaps = googleMaps;
            const mapEl = this.mapElementRef.nativeElement;
            const map = new googleMaps.Map(mapEl, {
                center: {
                    lat: this.eventService.coords ? this.eventService.coords.lat : 43.793514768383766,
                    lng: this.eventService.coords ? this.eventService.coords.lng : 21.44584259103658,
                },
                zoom: 14
            });

            if (this.eventService.coords) {
                const marker = new googleMaps.Marker({
                    position: {
                        lat: this.eventService.coords.lat,
                        lng: this.eventService.coords.lng
                    },
                    map,
                });
            }

            googleMaps.event.addListenerOnce(map, 'idle', () => {
                this.renderer.addClass(mapEl, 'visible');
            });

            this.clickListener = map.addListener('click', event => {
                const selectCoords = {lat: event.latLng.lat(), lng: event.latLng.lng()};
                this.modalCtrl.dismiss(selectCoords);
            });
        }).catch(reason => {
            console.log(reason);
        });
    }

    onCancel() {
        this.modalCtrl.dismiss();
    }

    ngOnDestroy() {
        this.googleMaps.event.removeListener(this.clickListener);
    }

    private getGoogleMaps(): Promise<any> {
        const win = window as any;
        const googleModule = win.google;
        if (googleModule && googleModule.maps) {
            return Promise.resolve(googleModule.maps);
        }
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
            script.onload = () => {
                const loadedGoogleModule = win.google;
                if (loadedGoogleModule && loadedGoogleModule.maps) {
                    resolve(loadedGoogleModule.maps);
                } else {
                    reject('SDK Google maps not available.');
                }
            };
        });
    }

}
