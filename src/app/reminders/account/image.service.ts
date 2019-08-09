import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    private _imageUrlSubject = new BehaviorSubject<string>(null);

    constructor(private httpClient: HttpClient) {
    }

    get imageUrlObservable() {
        return this._imageUrlSubject.asObservable();
    }

    fetchImage() {
        return this.httpClient
            .get<{ [key: string]: { imageUrl: string } }>(
                `https://ionic-to-do-project.firebaseio.com/d51o4LPOdXZWlxnu15c7spVD2QB2/image.json`
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
                uploadData
            )
            .pipe(
                switchMap(response => {
                    url = response.imageUrl;
                    return this.httpClient.delete('https://ionic-to-do-project.firebaseio.com/d51o4LPOdXZWlxnu15c7spVD2QB2/image.json');
                }),
                switchMap(() => {
                    return this.httpClient
                        .post(
                            `https://ionic-to-do-project.firebaseio.com/d51o4LPOdXZWlxnu15c7spVD2QB2/image.json`,
                            {imageUrl: url}
                        );
                }),
                switchMap((object: any) => {
                    return this.httpClient
                        .get(
                            `https://ionic-to-do-project.firebaseio.com/d51o4LPOdXZWlxnu15c7spVD2QB2/image/${object.name}.json`
                        ).pipe(
                            tap((data: any) => {
                                this._imageUrlSubject.next(data.imageUrl);
                            })
                        );
                })
            );
    }
}
