import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {User} from '../../auth/user.model';
import {ModalController} from '@ionic/angular';
import {tap} from 'rxjs/operators';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

    private user: User;

    constructor(private authService: AuthService, private modalCtrl: ModalController) {
    }

    ngOnInit() {
        this.authService.userObservable.pipe(tap(u => this.user = u)).subscribe();
    }

    onCancel() {
        this.modalCtrl.dismiss();
    }

    onLogout() {
        this.modalCtrl.dismiss().then(() => {
            this.authService.logOutUser();
        });
    }
}
