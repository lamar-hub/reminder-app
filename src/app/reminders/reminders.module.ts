import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {RemindersPage} from './reminders.page';
import {RemindersRoutingModule} from './reminders-routing.module';
import {AccountComponent} from './account/account.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RemindersRoutingModule
    ],
    declarations: [RemindersPage, AccountComponent],
    entryComponents: [AccountComponent]
})
export class RemindersPageModule {
}
