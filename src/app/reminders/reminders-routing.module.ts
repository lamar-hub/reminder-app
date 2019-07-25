import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RemindersPage} from './reminders.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: RemindersPage,
        children: [
            {
                path: 'events',
                children: [
                    {
                        path: '',
                        loadChildren: './events/events.module#EventsPageModule'
                    },
                    {
                        path: 'new',
                        loadChildren: './events/event-new/event-new.module#EventNewPageModule'
                    },
                    {
                        path: 'edit/:eventId',
                        loadChildren: './events/event-edit/event-edit.module#EventEditPageModule'
                    },
                    {
                        path: ':eventId',
                        loadChildren: './events/event-detail/event-detail.module#EventDetailPageModule'
                    }
                ]
            },
            {
                path: 'to-dos',
                children: [
                    {
                        path: '',
                        loadChildren: './to-dos/to-dos.module#ToDosPageModule'
                    },
                    {
                        path: 'new',
                        loadChildren: './to-dos/to-do-new/to-do-new.module#ToDoNewPageModule'
                    },
                    {
                        path: 'edit/:toDoId',
                        loadChildren: './to-dos/to-do-edit/to-do-edit.module#ToDoEditPageModule'
                    },
                ]
            },
            {path: '', redirectTo: '/reminders/tabs/events', pathMatch: 'full'}
        ]
    },
    {path: '', redirectTo: '/reminders/tabs/events', pathMatch: 'full'}
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class RemindersRoutingModule {
}
