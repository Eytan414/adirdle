import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { NoWordDialogComponent } from './dialogs/no-word-dialog/no-word-dialog.component';
import { WinDialogComponent } from './dialogs/win-dialog/win-dialog.component';
import { WaitDialogComponent } from './dialogs/wait-dialog/wait-dialog.component';
import { KeyboardComponent } from './main/keyboard/keyboard.component';
import { NextGuessRowComponent } from './main/next-guess-row/next-guess-row.component';
import { HeaderComponent } from './main/header/header.component';
import { SigninComponent } from './dialogs/signin-dialog/signin.component';
import { FormsModule } from '@angular/forms';
import { HighscoresComponent } from './highscores/highscores.component';
import { RecordCardComponent } from './highscores/record-card/record-card.component';

import { NgChartsModule } from 'ng2-charts';
import { ChartComponent } from './highscores/chart/chart.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NoWordDialogComponent,
    WinDialogComponent,
    WaitDialogComponent,
    KeyboardComponent,
    NextGuessRowComponent,
    HeaderComponent,
    SigninComponent,
    HighscoresComponent,
    RecordCardComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    DragDropModule,
    FormsModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
