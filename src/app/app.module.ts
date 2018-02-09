import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import * as fromModules from "../modules";
import * as fromServices from "../services";
import * as fromComponents from "../components";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent, ...fromComponents.components],
  imports: [BrowserModule, ...fromModules.modules],
  providers: [...fromServices.services],
  bootstrap: [AppComponent]
})
export class AppModule {}
