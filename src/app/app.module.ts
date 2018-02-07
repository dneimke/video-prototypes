import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import * as fromModules from "../modules";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ...fromModules.modules],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
