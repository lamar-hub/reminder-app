import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-event-edit',
    templateUrl: './event-edit.page.html',
    styleUrls: ['./event-edit.page.scss'],
})
export class EventEditPage implements OnInit {

    form: FormGroup;
    date = new Date();

    constructor(private navCtrl: NavController) {
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
