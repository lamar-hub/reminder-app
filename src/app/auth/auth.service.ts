import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {User} from './user.model';
import {map, tap} from 'rxjs/operators';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {Plugins} from '@capacitor/core';

interface AuthResponseData {
    email: string;
    expiresIn: string;
    idToken: string;
    kind: string;
    localId: string;
    refreshToken: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnDestroy {

    private _userSubject = new BehaviorSubject<User>(null);
    private logOutTimer: any;

    constructor(private httpClient: HttpClient, private router: Router) {
    }

    get userObservable(): Observable<User> {
        return this._userSubject.asObservable();
    }

    get userIsAuth(): Observable<boolean> {
        return this._userSubject
            .asObservable()
            .pipe(
                map(user => {
                    if (user) {
                        return !!user.token;
                    } else {
                        return false;
                    }
                })
            );
    }

    get getToken(): Observable<string> {
        return this._userSubject
            .asObservable()
            .pipe(
                map(user => {
                    if (user) {
                        return user.token;
                    } else {
                        return null;
                    }
                })
            );
    }

    get userId(): Observable<string> {
        return this._userSubject
            .asObservable()
            .pipe(
                map(user => {
                    if (user) {
                        return user.userId;
                    } else {
                        return null;
                    }
                })
            );
    }

    autoLogin() {
        return from(Plugins.Storage.get({key: 'authData'}))
            .pipe(
                map(storedData => {
                    if (!storedData || !storedData.value) {
                        return null;
                    }
                    const parsedData = JSON.parse(storedData.value) as
                        { userId: string, email: string, token: string, tokenExpirationDate: string };
                    const expirationTime = new Date(parsedData.tokenExpirationDate);
                    if (expirationTime <= new Date()) {
                        return null;
                    }
                    return new User(parsedData.userId, parsedData.email, parsedData.token, expirationTime);
                }),
                tap(user => {
                    if (user) {
                        this._userSubject.next(user);
                        this.autoLogOutUser(user.tokenDuration);
                    }
                }),
                map(user => {
                    return !!user;
                })
            );
    }

    signUpUser(email: string, password: string) {
        return this.httpClient
            .post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
                {email, password, returnSecureToken: true}
            );
    }

    logInUser(email: string, password: string) {
        return this.httpClient
            .post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
                {email, password, returnSecureToken: true}
            ).pipe(
                tap(authResponseData => {
                    let date = new Date();
                    date = new Date(date.setSeconds(date.getSeconds() + (+authResponseData.expiresIn)));
                    const user = new User(
                        authResponseData.localId,
                        authResponseData.email,
                        authResponseData.idToken,
                        date);
                    console.log(user);
                    this._userSubject.next(user);
                    this.storeAuthData(authResponseData.localId, authResponseData.email, authResponseData.idToken, date.toISOString());
                    this.autoLogOutUser(user.tokenDuration);
                })
            );
    }

    logOutUser() {
        if (this.logOutTimer) {
            clearTimeout(this.logOutTimer);
        }
        this.router.navigateByUrl('/auth');
        this._userSubject.next(null);
        Plugins.Storage.remove({key: 'authData'});
    }

    ngOnDestroy(): void {
        if (this.logOutTimer) {
            clearTimeout(this.logOutTimer);
        }
    }

    private autoLogOutUser(duration: number) {
        if (this.logOutTimer) {
            clearTimeout(this.logOutTimer);
        }
        this.logOutTimer = setTimeout(() => {
            this.logOutUser();
        }, duration);
    }

    private storeAuthData(userId: string, email: string, token: string, tokenExpirationDate: string) {
        console.log(tokenExpirationDate);
        const data = JSON.stringify({
            userId,
            email,
            token,
            tokenExpirationDate
        });
        Plugins.Storage.set({
            key: 'authData',
            value: data
        });
    }
}
