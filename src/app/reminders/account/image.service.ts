import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ImageService implements OnDestroy {

    private _imageUrlSubject = new BehaviorSubject<string>(null);
    private userId: string;
    private token: string;
    private readonly sub: Subscription;
    private readonly sub2: Subscription;

    constructor(private httpClient: HttpClient, private authService: AuthService) {
        this.sub = this.authService.userObservable
            .pipe(
                map(user => {
                    if (!user) {
                        return null;
                    }
                    return user.userId;
                })
            )
            .subscribe(id => {
                console.log(id);
                this.userId = id;
            });

        this.sub2 = this.authService.getToken.subscribe(token => {
            this.token = token;
        });
    }

    get imageUrlObservable() {
        return this._imageUrlSubject.asObservable();
    }

    fetchImage() {
        return this.httpClient
            .get<{ [key: string]: { imageUrl: string } }>(
                `https://ionic-to-do-project.firebaseio.com/${this.userId}/image.json?auth=${this.token}`
            )
            .pipe(
                tap((responseData: any) => {
                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            this._imageUrlSubject.next(responseData[key].imageUrl);
                        }
                    }
                })
            );
    }

    uploadImage(image: File) {
        const uploadData = new FormData();
        let url: string;

        uploadData.append('image', image);

        return this.httpClient
            .post<{ imagePath: string, imageUrl: string }>(
                'https://us-central1-ionic-to-do-project.cloudfunctions.net/storeImage',
                uploadData,
                {
                    headers: {
                        Authorization: 'Bearer ' + this.token
                    }
                }
            )
            .pipe(
                switchMap(response => {
                    url = response.imageUrl;
                    return this.httpClient
                        .delete(`https://ionic-to-do-project.firebaseio.com/${this.userId}/image.json?auth=${this.token}`);
                }),
                switchMap(() => {
                    return this.httpClient
                        .post(
                            `https://ionic-to-do-project.firebaseio.com/${this.userId}/image.json?auth=${this.token}`,
                            {imageUrl: url}
                        );
                }),
                switchMap((object: any) => {
                    return this.httpClient
                        .get(
                            `https://ionic-to-do-project.firebaseio.com/${this.userId}/image/${object.name}.json?auth=${this.token}`
                        ).pipe(
                            tap((data: any) => {
                                this._imageUrlSubject.next(data.imageUrl);
                            })
                        );
                })
            );
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
