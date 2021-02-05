import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QubusSimpleComponent } from './components/qubusSimple/qubusSimple.component';
import { RouterModule, Routes } from '@angular/router';
import { WindmillComponent } from './components/windmill/windmill.component';
import { AnimationComponent } from './components/animation/animation.component';
import { FirstpersonComponent } from './components/firstperson/firstperson.component';



const routes: Routes = [
  { path: 'qubusSimple', component: QubusSimpleComponent },
  { path: 'windmill', component: WindmillComponent },
  { path: 'animation', component: AnimationComponent },
  { path: 'firstperson', component: FirstpersonComponent },

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    [RouterModule.forRoot(routes)]
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
