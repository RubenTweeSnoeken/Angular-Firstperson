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
import { VirtualRealityComponent } from './components/virtual-reality/virtual-reality.component';
import { ParticlesComponent } from './components/particles/particles.component';
import { WaterfountainComponent } from './components/waterfountain/waterfountain.component';
import { Waterfountain2Component } from './components/waterfountain2/waterfountain2.component';
import { ScreenRecorderComponent } from './components/sceen-recorder/screen-recorder.component';
import { SplineEditorComponent } from './components/spline-editor/spline-editor.component';

const routes: Routes = [
  { path: 'qubusSimple', component: QubusSimpleComponent },
  { path: 'windmill', component: WindmillComponent },
  { path: 'animation', component: AnimationComponent },
  { path: 'firstperson', component: FirstpersonComponent },
  { path: 'ar-image', component: ArImageComponent },
  { path: 'ar-location', component: ArLocationComponent },
  { path: 'ar-marker', component: ArMarkerComponent },
  { path: 'vr-handtracking', component: VirtualRealityComponent },
  { path: 'particles', component: ParticlesComponent },
  { path: 'waterfountain', component: WaterfountainComponent },
  { path: 'waterfountainColorFoul', component: Waterfountain2Component },
  { path: 'screen-recorder', component: ScreenRecorderComponent },
  { path: 'spline-editor', component: SplineEditorComponent },

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
