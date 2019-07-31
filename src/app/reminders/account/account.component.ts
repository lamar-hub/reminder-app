import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {User} from '../../auth/user.model';
import {AlertController, ModalController} from '@ionic/angular';
import {tap} from 'rxjs/operators';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

    private user: User;

    constructor(private authService: AuthService, private modalCtrl: ModalController, private alertCtrl: AlertController) {
    }

    ngOnInit() {
        this.authService.userObservable.pipe(tap(u => this.user = u)).subscribe();
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
}
