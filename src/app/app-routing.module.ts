import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QubusSimpleComponent } from './components/qubusSimple/qubusSimple.component';
import { RouterModule, Routes } from '@angular/router';
import { WindmillComponent } from './components/windmill/windmill.component';
import { AnimationComponent } from './components/animation/animation.component';
import { FirstpersonComponent } from './components/firstperson/firstperson.component';
import { ArImageComponent } from './components/ar-image-scan/ar-image-scan.component';
import { ArMarkerComponent } from './components/ar-marker/ar-marker.component';
import { ArLocationComponent } from './components/ar-location/ar-location.component';



const routes: Routes = [
  { path: 'qubusSimple', component: QubusSimpleComponent },
  { path: 'windmill', component: WindmillComponent },
  { path: 'animation', component: AnimationComponent },
  { path: 'firstperson', component: FirstpersonComponent },
  { path: 'ar-image', component: ArImageComponent },
  { path: 'ar-location', component: ArLocationComponent },
  { path: 'ar-marker', component: ArMarkerComponent },

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
