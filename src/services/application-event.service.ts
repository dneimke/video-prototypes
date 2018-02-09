// https://angular.io/guide/component-interaction#parent-and-children-communicate-via-a-service
// http://amp.azure.net/libs/amp/latest/docs/index.html#release-notes

import { Subject } from "rxjs/Subject";
import { MediaLoadedEvent, MediaSource } from "../models";

export class ApplicationEventService {
  // Observable string source
  private navigateToSource = new Subject<number>();
  private mediaLoadedSource = new Subject<MediaLoadedEvent>();
  private sourceChangedSource = new Subject<MediaSource>();

  // Observable string streams
  navigateTo$ = this.navigateToSource.asObservable();
  mediaLoaded$ = this.mediaLoadedSource.asObservable();
  sourceChanged$ = this.sourceChangedSource.asObservable();

  // Service message commands
  navigateTo(time: number): void {
    this.navigateToSource.next(time);
  }

  mediaLoaded(e: MediaLoadedEvent) {
    this.mediaLoadedSource.next(e);
  }

  matchChanged(mediaSource: MediaSource) {
    this.sourceChangedSource.next(mediaSource);
  }
}
