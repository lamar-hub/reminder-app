import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, forkJoin, Subscription} from 'rxjs';
import {ToDo} from './to-do.model';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {AuthService} from '../../auth/auth.service';

interface ToDoData {
    title: string;
    done: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ToDoService implements OnDestroy {

    private _toDosSubject = new BehaviorSubject<ToDo[]>([]);
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

    get toDosObservable() {
        return this._toDosSubject.asObservable();
    }

    fetchAllToDos() {
        return this.httpClient
            .get<{ [key: string]: ToDoData }>(`https://ionic-to-do-project.firebaseio.com/${this.userId}/to-dos.json?auth=${this.token}`)
            .pipe(
                map(responseData => {
                    const toDos = [];
                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            toDos.push(new ToDo(key, responseData[key].title, responseData[key].done));
                        }
                    }
                    return toDos;
                }),
                tap(toDos => {
                    this._toDosSubject.next(toDos);
                })
            );
    }

    getToDo(id: string) {
        return this.httpClient
            .get<ToDoData>(`https://ionic-to-do-project.firebaseio.com/${this.userId}/to-dos/${id}.json?auth=${this.token}`)
            .pipe(
                map(responseData => {
                    return new ToDo(id, responseData.title, responseData.done);
                })
            );
    }

    addToDo(title: string) {
        const newToDo = new ToDo('1', title, false);

        let generatedId: string;

        return this.httpClient
            .post<{ name: string }>(`https://ionic-to-do-project.firebaseio.com/${this.userId}/to-dos.json?auth=${this.token}`,
                {...newToDo, id: null})
            .pipe(
                switchMap(responseData => {
                    generatedId = responseData.name;
                    return this.toDosObservable;
                }),
                take(1),
                tap(toDos => {
                    newToDo.id = generatedId;
                    this._toDosSubject.next(toDos.concat(newToDo));
                })
            );
    }

    updateToDo(id: string, title: string, done: boolean) {
        let updatedToDos: ToDo[];
        return this.toDosObservable
            .pipe(
                take(1),
                switchMap(toDos => {
                    const index = toDos.findIndex(toDo => toDo.id === id);
                    updatedToDos = [...toDos];
                    updatedToDos[index].title = title;
                    updatedToDos[index].done = done;

                    return this.httpClient
                        .put(`https://ionic-to-do-project.firebaseio.com/${this.userId}/to-dos/${id}.json?auth=${this.token}`,
                            {...updatedToDos[index], id: null});
                }),
                tap(() => {
                    this._toDosSubject.next(updatedToDos);
                })
            );
    }

    deleteToDo(id: string) {
        return this.httpClient
            .delete(`https://ionic-to-do-project.firebaseio.com/${this.userId}/to-dos/${id}.json?auth=${this.token}`)
            .pipe(
                switchMap(() => {
                    return this.toDosObservable;
                }),
                take(1),
                map(toDos => {
                    return toDos.filter(toDo => toDo.id !== id);
                }),
                tap(toDos => {
                    const updatedToDo = toDos.filter(toDo => toDo.id !== id);
                    this._toDosSubject.next(updatedToDo);
                }),
            );
    }

    deleteAllDoneToDos(idArray: string[]) {
        const observables = [];
        idArray.forEach(id => observables.push(this.deleteToDo(id)));

        return forkJoin(observables);
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
