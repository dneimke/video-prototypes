import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import * as fromModules from "../modules";
import * as fromServices from "../services";
import * as fromComponents from "../components";
import * as fromContainers from "../containers";

import { AppComponent } from "./app.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "clips" },
  { path: "clips", component: fromContainers.ViewClipsComponent }
];

@NgModule({
  declarations: [AppComponent, ...fromContainers.containers, ...fromComponents.components],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    ...fromModules.modules
  ],
  providers: [...fromServices.services],
  bootstrap: [AppComponent]
})
export class AppModule {}
