import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToDo} from './to-do.model';
import {ActionSheetController, IonItemSliding, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {ToDoService} from './to-do.service';
import {Subscription} from 'rxjs';
import {AccountComponent} from '../account/account.component';
import {ImageService} from '../account/image.service';
import {SafeResourceUrl} from '@angular/platform-browser';

@Component({
    selector: 'app-to-dos',
    templateUrl: './to-dos.page.html',
    styleUrls: ['./to-dos.page.scss'],
})
export class ToDosPage implements OnInit, OnDestroy {

    loading = true;
    toDos: ToDo[] = [];
    toDosDone: ToDo[] = [];
    imageUrl: SafeResourceUrl;
    private sub: Subscription;
    private sub2: Subscription;
    private sub3: Subscription;
    private sub4: Subscription;

    constructor(private router: Router,
                private toDoService: ToDoService,
                private modalCtrl: ModalController,
                private actionSheetCtrl: ActionSheetController,
                private imageService: ImageService) {
    }

    ngOnInit() {
        this.sub = this.toDoService.toDosObservable.subscribe(toDos => {
            this.toDos = toDos.filter(toDo => !toDo.done);
            this.toDosDone = toDos.filter(toDo => toDo.done);
        });
        this.sub4 = this.imageService.imageUrlObservable.subscribe(url => {
            this.imageUrl = url;
        });
    }

    ionViewWillEnter() {
        this.loading = true;
        this.sub2 = this.toDoService.fetchAllToDos().subscribe(() => this.loading = false);
    }

    onEditToDo(id: string, slider: IonItemSliding) {
        slider.closeOpened().then(() => this.router.navigate(['/', 'reminders', 'tabs', 'to-dos', 'edit', id]));
    }

    onDeleteToDo(id: string, slider: IonItemSliding) {
        slider.close();
        this.actionSheetCtrl.create({
            header: 'To-do',
            subHeader: 'Do you want to delete this to-do?',
            cssClass: 'action-sheet-global',
            mode: 'ios',
            buttons: [
                {
                    text: 'Delete',
                    handler: () => {
                        this.loading = true;
                        slider.closeOpened().then(() => this.sub3 = this.toDoService.deleteToDo(id).subscribe(() => this.loading = false));
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                }
            ]
        }).then(asel => {
            asel.present();
        });
    }

    onEditToDoDone(toDo: ToDo) {
        this.toDoService.updateToDo(toDo.id, toDo.title, toDo.done).subscribe();
    }

    openAccount() {
        this.modalCtrl
            .create(
                {
                    component: AccountComponent,
                }
            )
            .then(modalEl => {
                modalEl.present();
            });
    }

    onDeleteAllDoneToDos() {
        this.actionSheetCtrl.create({
            header: 'To-do',
            subHeader: 'Do you want to delete all done to-dos?',
            cssClass: 'action-sheet-global',
            mode: 'ios',
            buttons: [
                {
                    text: 'Delete ALL',
                    handler: () => {
                        this.loading = true;
                        this.toDoService.deleteAllDoneToDos(this.toDosDone.map(toDo => toDo.id)).subscribe(() => this.loading = false);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        }).then(asel => {
            asel.present();
        });
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        if (this.sub2) {
            this.sub2.unsubscribe();
        }
        if (this.sub3) {
            this.sub3.unsubscribe();
        }
        if (this.sub4) {
            this.sub4.unsubscribe();
        }
    }
}
