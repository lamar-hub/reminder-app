import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToDo} from './to-do.model';
import {IonItemSliding} from '@ionic/angular';
import {Router} from '@angular/router';
import {ToDoService} from './to-do.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-to-dos',
    templateUrl: './to-dos.page.html',
    styleUrls: ['./to-dos.page.scss'],
})
export class ToDosPage implements OnInit, OnDestroy {

    toDos: ToDo[] = [];
    toDosDone: ToDo[] = [];
    private sub: Subscription;

    constructor(private router: Router, private toDoService: ToDoService) {
    }

    ngOnInit() {
        this.sub = this.toDoService.toDosObservable.subscribe(toDos => {
            this.toDos = toDos.filter(toDo => !toDo.done);
            this.toDosDone = toDos.filter(toDo => toDo.done);
        });
    }

    ionViewWillEnter() {
        this.toDoService.fetchAllToDos().subscribe();
    }

    onEditToDo(id: string, slider: IonItemSliding) {
        slider.closeOpened();
        this.router.navigate(['/', 'reminders', 'tabs', 'to-dos', 'edit', id]);
    }

    onDeleteToDo(id: string, slider: IonItemSliding) {
        slider.closeOpened();
        this.toDoService.deleteToDo(id).subscribe();
    }

    onEditToDoDone(toDo: ToDo) {
        this.toDoService.updateToDo(toDo.id, toDo.title, toDo.done).subscribe();
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
