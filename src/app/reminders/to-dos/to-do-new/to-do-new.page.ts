import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToDoService} from '../to-do.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-to-do-new',
    templateUrl: './to-do-new.page.html',
    styleUrls: ['./to-do-new.page.scss'],
})
export class ToDoNewPage implements OnInit, OnDestroy {

    form: FormGroup;
    private sub: Subscription;

    constructor(private navCtrl: NavController, private toDoService: ToDoService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, {updateOn: 'change', validators: [Validators.required]})
        });
    }

    onCreateToDo() {
        this.sub = this.toDoService.addToDo(this.form.get('title').value).subscribe(() => this.navCtrl.pop());
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
