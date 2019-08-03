import {Component} from '@angular/core';
import {Capacitor, Plugins} from '@capacitor/core';

import {Platform} from '@ionic/angular';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(
        private platform: Platform,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            if (Capacitor.isPluginAvailable('SplashScreen')) {
                Plugins.SplashScreen.hide();
            }
        });
    }
}
