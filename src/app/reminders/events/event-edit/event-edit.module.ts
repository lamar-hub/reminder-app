import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {EventEditPage} from './event-edit.page';
import {SharedModule} from '../../../shared/shared.module';

const routes: Routes = [
    {
        path: '',
        component: EventEditPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonicModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [EventEditPage]
})
export class EventEditPageModule {
}
