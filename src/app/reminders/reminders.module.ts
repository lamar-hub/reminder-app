import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {RemindersPage} from './reminders.page';
import {RemindersRoutingModule} from './reminders-routing.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RemindersRoutingModule
    ],
    declarations: [RemindersPage]
})
export class RemindersPageModule {
}
