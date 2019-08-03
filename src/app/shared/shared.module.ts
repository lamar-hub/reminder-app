import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapModalComponent} from './map-modal/map-modal.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
    declarations: [MapModalComponent],
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [MapModalComponent],
    entryComponents: [MapModalComponent]
})
export class SharedModule {
}
