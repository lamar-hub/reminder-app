import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {User} from './user.model';
import {tap} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';

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
export class AuthService {

    private _userSubject = new BehaviorSubject<User>(null);

    constructor(private httpClient: HttpClient, private router: Router) {
    }

    get userObservable(): Observable<User> {
        return this._userSubject.asObservable();
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
                    const user = new User(
                        authResponseData.localId,
                        authResponseData.email,
                        authResponseData.idToken,
                        authResponseData.expiresIn);
                    console.log(user);
                    this._userSubject.next(user);
                })
            );
    }

    logOutUser() {
        this.router.navigateByUrl('/auth');
        this._userSubject.next(null);
    }
}
