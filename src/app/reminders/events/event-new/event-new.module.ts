import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {EventNewPage} from './event-new.page';
import {SharedModule} from '../../../shared/shared.module';

const routes: Routes = [
    {
        path: '',
        component: EventNewPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [EventNewPage]
})
export class EventNewPageModule {
}
