import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { QubusSimpleComponent } from './components/qubusSimple/qubusSimple.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
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


@NgModule({
  declarations: [
    AppComponent,
    QubusSimpleComponent,
    NavbarComponent,
    FooterComponent,
    AnimationComponent,
    WindmillComponent,
    AnimationComponent,
    FirstpersonComponent,
    ArImageComponent,
    ArMarkerComponent,
    ArLocationComponent,
    VirtualRealityComponent,
    ParticlesComponent,
    WaterfountainComponent,
    Waterfountain2Component,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule {
}
