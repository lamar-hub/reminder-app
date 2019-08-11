import {Injectable} from '@angular/core';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from './auth.service';
import {switchMap, take, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad {

    constructor(private authService: AuthService, private router: Router) {
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        // return this.authService.userObservable
        //     .pipe(
        //         take(1),
        //         map(user => !!user),
        //         tap(loadable => {
        //             if (!loadable) {
        //                 this.router.navigateByUrl('/auth');
        //             }
        //         })
        //     );
        return this.authService.userIsAuth
            .pipe(
                take(1),
                switchMap(loadable => {
                    if (!loadable) {
                        return this.authService.autoLogin();
                    }
                    return of(loadable);
                }),
                tap(loadable => {
                    if (!loadable) {
                        this.router.navigateByUrl('/auth');
                    }
                })
            );
    }

}
