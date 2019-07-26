import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {User} from './user.model';
import {tap} from 'rxjs/operators';

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

    private _user: User;

    get user(): User {
        return this._user;
    }

    constructor(private httpClient: HttpClient) {
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
                    this._user = new User(
                        authResponseData.localId,
                        authResponseData.email,
                        authResponseData.idToken,
                        authResponseData.expiresIn);
                })
            );
    }
}
