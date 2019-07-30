import {Injectable} from '@angular/core';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {map, take, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad {

    constructor(private authService: AuthService, private router: Router) {
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.userObservable
            .pipe(
                take(1),
                map(user => !!user),
                tap(loadable => {
                    if (!loadable) {
                        this.router.navigateByUrl('/auth');
                    }
                })
            );
    }

}
