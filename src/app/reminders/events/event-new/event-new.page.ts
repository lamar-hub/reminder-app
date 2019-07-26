import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventService} from '../event.service';

@Component({
    selector: 'app-event-new',
    templateUrl: './event-new.page.html',
    styleUrls: ['./event-new.page.scss'],
})
export class EventNewPage implements OnInit {

    form: FormGroup;
    date = new Date();

    constructor(private navCtrl: NavController, private eventService: EventService) {
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
}
