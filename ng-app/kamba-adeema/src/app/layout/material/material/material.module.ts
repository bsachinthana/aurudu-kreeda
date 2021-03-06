import { HomeComponent } from './../../home/home.component';
import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog'

const metrialComponents = [
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatDialogModule
];

@NgModule({
  declarations: [],
  imports: [metrialComponents],
  exports: [metrialComponents] 
})
export class MaterialModule {}
