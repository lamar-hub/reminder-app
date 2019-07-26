import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

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
            );
    }
}
