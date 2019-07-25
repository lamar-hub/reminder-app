import {Component, OnInit} from '@angular/core';
import {ToDo} from './to-do.model';
import {IonItemSliding} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
    selector: 'app-to-dos',
    templateUrl: './to-dos.page.html',
    styleUrls: ['./to-dos.page.scss'],
})
export class ToDosPage implements OnInit {

    toDos: ToDo[] = [
        new ToDo('123', 'Uci', false),
        new ToDo('124', 'Trci', false),
        new ToDo('125', 'Jedi', false)];
    toDosDone: ToDo[] = [
        new ToDo('126', 'Spavaj', true)
    ];

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    onEditToDo(id: string, slider: IonItemSliding) {
        slider.closeOpened();
        this.router.navigate(['/', 'reminders', 'tabs', 'to-dos', 'edit', id]);
    }

    onDeleteToDo(id: string, slider: IonItemSliding) {
        slider.closeOpened();
    }

    onEditToDoDone(toDo: ToDo) {

    }
}
