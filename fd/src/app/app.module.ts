import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AttributeClosureComponent } from './components/features/attribute-closure/attribute-closure.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParserComponent } from './components/features/parser/parser.component';
import { MinimalCoverComponent } from './components/features/minimal-cover/minimal-cover.component';
import { EquivalenceCheckerComponent } from './components/features/equivalence-checker/equivalence-checker.component';

@NgModule({
  declarations: [
    AppComponent,
    AttributeClosureComponent,
    ParserComponent,
    MinimalCoverComponent,
    EquivalenceCheckerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
