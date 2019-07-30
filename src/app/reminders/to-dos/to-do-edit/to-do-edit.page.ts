import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToDo} from '../to-do.model';
import {ToDoService} from '../to-do.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-to-do-edit',
    templateUrl: './to-do-edit.page.html',
    styleUrls: ['./to-do-edit.page.scss'],
})
export class ToDoEditPage implements OnInit, OnDestroy {

    toDo: ToDo;
    form: FormGroup;
    private sub: Subscription;
    private sub2: Subscription;

    constructor(private navCtrl: NavController, private toDoService: ToDoService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, {updateOn: 'change', validators: [Validators.required]})
        });
        this.route.paramMap.subscribe(paramMap => {
            this.sub = this.toDoService.getToDo(paramMap.get('toDoId')).subscribe(toDo => {
                this.toDo = toDo;
                this.form.setValue({
                    title: this.toDo.title
                });
            });
        });
    }

    onEditToDo() {
        this.sub2 = this.toDoService.updateToDo(this.toDo.id, this.form.get('title').value, this.toDo.done).subscribe(() => {
            this.navCtrl.pop();
        });
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
