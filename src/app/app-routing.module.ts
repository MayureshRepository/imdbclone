import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { MainComponent } from './main/main.component';
import { FavoriteComponent } from './favorite/favorite.component';

const routes: Routes = [
 {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'details/:id',component:DetailsComponent},
  {path:'home' ,component:MainComponent},
  {path:'favorites',component:FavoriteComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
