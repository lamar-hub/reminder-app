import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, forkJoin, Subscription} from 'rxjs';
import {Event} from './event.model';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {PlaceLocation} from './location.model';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../auth/auth.service';

interface EventData {
    title: string;
    notes: string;
    date: Date;
    beginTime: Date;
    endTime: Date;
    location: PlaceLocation;
}

@Injectable({
    providedIn: 'root'
})
export class EventService implements OnDestroy {

    private _eventsSubject = new BehaviorSubject<Event[]>([]);
    private _coords: { lat: number, lng: number };
    private userId: string;
    private token: string;
    private readonly sub: Subscription;
    private readonly sub2: Subscription;

    constructor(private httpClient: HttpClient, private authService: AuthService) {
        this.sub = this.authService.userId.subscribe(id => {
            this.userId = id;
        });
        this.sub2 = this.authService.getToken.subscribe(token => {
            this.token = token;
        });
    }

    get eventsObservable() {
        return this._eventsSubject.asObservable();
    }

    get coords(): { lat: number; lng: number } {
        return this._coords;
    }

    set coords(value: { lat: number; lng: number }) {
        this._coords = value;
    }

    fetchAllEvents() {
        return this.httpClient
            .get<{ [key: string]: EventData }>(`https://ionic-to-do-project.firebaseio.com/${this.userId}/events.json?auth=${this.token}`)
            .pipe(
                map(responseData => {
                    const events = [];
                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            events.push(new Event(
                                key,
                                responseData[key].title,
                                responseData[key].notes,
                                responseData[key].date,
                                responseData[key].beginTime,
                                responseData[key].endTime,
                                responseData[key].location,
                            ));
                        }
                    }
                    return events;
                }),
                tap(events => {
                    this._eventsSubject.next(events);
                })
            );
    }

    getEvent(id: string) {
        return this.httpClient
            .get<EventData>(`https://ionic-to-do-project.firebaseio.com/${this.userId}/events/${id}.json?auth=${this.token}`)
            .pipe(
                map(responseData => {
                    return new Event(id, responseData.title, responseData.notes,
                        responseData.date, responseData.beginTime, responseData.endTime, responseData.location);
                })
            );
    }

    addEvent(title: string, date: string, beginTime: string, endTime: string, location: PlaceLocation, notes: string) {
        const newEvent = new Event('1', title, notes, new Date(date), new Date(beginTime), new Date(endTime), location);
        let generatedId: string;

        return this.httpClient
            .post<{ name: string }>(`https://ionic-to-do-project.firebaseio.com/${this.userId}/events.json?auth=${this.token}`,
                {...newEvent, id: null})
            .pipe(
                switchMap(responseData => {
                    generatedId = responseData.name;
                    return this.eventsObservable;
                }),
                take(1),
                tap(events => {
                    newEvent.id = generatedId;
                    this._eventsSubject.next(events.concat(newEvent));
                })
            );
    }

    updateEvent(id: string, title: string, date: Date, beginTime: Date, endTime: Date, location: PlaceLocation, notes: string) {
        let updatedEvents: Event[];
        return this.eventsObservable
            .pipe(take(1),
                switchMap(events => {
                    const index = events.findIndex(event => event.id === id);
                    updatedEvents = [...events];
                    updatedEvents[index].title = title;
                    updatedEvents[index].notes = notes;
                    updatedEvents[index].beginTime = beginTime;
                    updatedEvents[index].endTime = endTime;
                    updatedEvents[index].date = date;
                    updatedEvents[index].location = location;

                    return this.httpClient
                        .put(`https://ionic-to-do-project.firebaseio.com/${this.userId}/events/${id}.json?auth=${this.token}`,
                            {...updatedEvents[index], id: null});
                }),
                tap(() => {
                    this._eventsSubject.next(updatedEvents);
                })
            );
    }

    deleteEvent(id: string) {
        return this.httpClient
            .delete(`https://ionic-to-do-project.firebaseio.com/${this.userId}/events/${id}.json?auth=${this.token}`)
            .pipe(
                switchMap(() => {
                    return this.eventsObservable;
                }),
                take(1),
                map(events => {
                    return events.filter(ev => ev.id !== id);
                }),
                tap(events => {
                    this._eventsSubject.next(events);
                }),
            );
    }

    getAddress(lat: number, lng: number) {
        return this.httpClient
            .get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApiKey}`)
            .pipe(
                map(geoData => {
                    if (!geoData || !geoData.results || geoData.results.length === 0) {
                        return null;
                    }
                    return geoData.results[0].formatted_address;
                })
            );
    }

    getAppImage(lat: number, lng: number, zoom: number) {
        return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=5000x300&maptype=roadmap
                        &markers=color:red%7Clabel:Place%7C${lat},${lng}&key=${environment.googleMapsApiKey}`;
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        if (this.sub2) {
            this.sub2.unsubscribe();
        }
    }

    deleteAllPastEvents(idArray: string[]) {
        const observables = [];
        idArray.forEach(id => observables.push(this.deleteEvent(id)));

        return forkJoin(observables);
    }
}
