import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {User} from '../../auth/user.model';
import {AlertController, ModalController} from '@ionic/angular';
import {tap} from 'rxjs/operators';
import {CameraPhoto, CameraResultType, CameraSource, Capacitor, Plugins} from '@capacitor/core';
import {SafeResourceUrl} from '@angular/platform-browser';
import {ImageService} from './image.service';
import {Subscription} from 'rxjs';

function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = window.atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        const begin = sliceIndex * sliceSize;
        const end = Math.min(begin + sliceSize, bytesLength);

        const bytes = new Array(end - begin);
        for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }

    return new Blob(byteArrays, {type: contentType});
}

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {

    private user: User;
    private photo: SafeResourceUrl;
    private sub: Subscription;

    constructor(private authService: AuthService,
                private modalCtrl: ModalController,
                private alertCtrl: AlertController,
                private imageService: ImageService
    ) {
    }

    ngOnInit() {
        this.authService.userObservable.pipe(tap(u => this.user = u)).subscribe();
    }

    ionViewWillEnter() {
        this.sub = this.imageService.imageUrlObservable.subscribe(url => {
            this.photo = url;
        });
    }

    onCancel() {
        this.modalCtrl.dismiss();
    }

    onLogout() {
        this.alertCtrl.create({
            header: 'Logout',
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        this.modalCtrl.dismiss().then(() => {
                            this.authService.logOutUser();
                        });
                    }
                },
                {
                    text: 'No',
                    role: 'destructive'
                }
            ]
        }).then(asel => {
            asel.present();
        });
    }

    onPickPicture() {
        if (!Capacitor.isPluginAvailable('Camera')) {
            return;
        }
        Plugins.Camera
            .getPhoto({
                quality: 100,
                allowEditing: false,
                resultType: CameraResultType.Base64,
                source: CameraSource.Camera
            })
            .catch(reason => {
                console.log(reason);
            })
            .then((image: CameraPhoto) => {
                let imageFile;
                try {
                    imageFile = base64toBlob(image.base64String.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
                } catch (error) {
                    console.log(error);
                }
                this.imageService.uploadImage(imageFile).subscribe();
            });
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

}
