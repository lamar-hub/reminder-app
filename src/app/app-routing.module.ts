import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: '', redirectTo: '/auth', pathMatch: 'full'},
    {path: 'auth', loadChildren: './auth/auth.module#AuthPageModule'},
    {path: 'sign-up', loadChildren: './auth/sign-up/sign-up.module#SignUpPageModule'},
    {path: 'reminders', loadChildren: './reminders/reminders.module#RemindersPageModule'},
    {path: '**', redirectTo: '/auth'},
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
