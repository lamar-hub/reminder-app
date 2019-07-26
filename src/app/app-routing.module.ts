import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
    {path: '', redirectTo: '/auth', pathMatch: 'full'},
    {path: 'auth', loadChildren: './auth/auth.module#AuthPageModule'},
    {path: 'sign-up', loadChildren: './auth/sign-up/sign-up.module#SignUpPageModule'},
    {path: 'reminders', loadChildren: './reminders/reminders.module#RemindersPageModule', canLoad: [AuthGuard]},
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
