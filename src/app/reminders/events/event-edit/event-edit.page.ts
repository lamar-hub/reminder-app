import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Event} from '../event.model';
import {Subscription} from 'rxjs';
import {EventService} from '../event.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-event-edit',
    templateUrl: './event-edit.page.html',
    styleUrls: ['./event-edit.page.scss'],
})
export class EventEditPage implements OnInit, OnDestroy {

    event: Event;
    form: FormGroup;
    date = new Date();
    private sub: Subscription;
    private sub2: Subscription;

    constructor(private navCtrl: NavController, private eventService: EventService, private route: ActivatedRoute) {
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
                this.form.setValue({
                    title: this.event.title,
                    date: this.event.date,
                    time: {
                        beginTime: this.event.beginTime,
                        endTime: this.event.endTime,
                    },
                    location: this.event.location,
                    notes: this.event.notes
                });
            });
        });
    }

    onEditEvent() {
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

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        if (this.sub2) {
            this.sub2.unsubscribe();
        }
    }
}
