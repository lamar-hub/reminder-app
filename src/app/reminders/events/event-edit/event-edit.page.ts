import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Event} from '../event.model';

@Component({
    selector: 'app-event-edit',
    templateUrl: './event-edit.page.html',
    styleUrls: ['./event-edit.page.scss'],
})
export class EventEditPage implements OnInit {

    event: Event = new Event('123', 'Svadba', 'Kupi pokolon', new Date(), new Date(), new Date(), 'Krezbinac');
    form: FormGroup;
    date = new Date();

    constructor(private navCtrl: NavController) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(this.event.title, {updateOn: 'change', validators: [Validators.required]}),
            date: new FormControl(this.event.date.toISOString(), {updateOn: 'change', validators: [Validators.required]}),
            time: new FormGroup({
                beginTime: new FormControl(this.event.beginTime.toISOString(), {updateOn: 'change', validators: [Validators.required]}),
                endTime: new FormControl(this.event.endTime.toISOString(), {updateOn: 'change', validators: [Validators.required]}),
            }, {updateOn: 'change', validators: [this.endTimeValidator]}),
            location: new FormControl(this.event.location, {updateOn: 'change'}),
            notes: new FormControl(this.event.notes, {updateOn: 'change'}),
        });
    }

    onEditEvent() {
        this.navCtrl.pop();
    }

    endTimeValidator(control: AbstractControl): { [key: string]: boolean } | null {
        if (new Date(control.get('endTime').value) <= new Date(control.get('beginTime').value)) {
            return {dateMin: false};
        }
        return null;
    }
}
