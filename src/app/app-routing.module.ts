import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QubusSimpleComponent } from './components/qubusSimple/qubusSimple.component';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  { path: 'qubusSimple', component: QubusSimpleComponent }
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
