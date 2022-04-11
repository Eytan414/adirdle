import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { HeaderComponent } from './main/header/header.component';
import { NextGuessRowComponent } from './main/next-guess-row/next-guess-row.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NoWordDialogComponent,
    WinDialogComponent,
    WaitDialogComponent,
    KeyboardComponent,
    HeaderComponent,
    NextGuessRowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
