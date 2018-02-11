import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { VgAPI } from "videogular2/core";
import { TimerService, ApplicationEventService } from "../../services";
import { Observable } from "rxjs/Observable";
import { MediaSource, ClipEvent } from "../../models";

@Component({
  selector: "video-player",
  template: `
    <vg-player (onPlayerReady)="onPlayerReady($event)">
      
      <vg-controls> 
          <vg-play-pause></vg-play-pause>
          <vg-time-display vgProperty="current" vgFormat="mm:ss"></vg-time-display>
          <vg-volume></vg-volume>
      </vg-controls>
      
      <video #media [vgMedia]="media" id="singleVideo" preload="auto">
          <source [src]="source.src" [type]="source.type">
      </video>

    </vg-player>
  `,
  styleUrls: ["./video-player.component.css"]
})
export class VideoPlayerComponent implements OnInit {
  @Input() source: MediaSource;
  @Input() timer$: Observable<ClipEvent>;
  @Input() playState$: Observable<boolean>;
  @Input() autoPlay: boolean = false;

  @Output() currentTime$ = new EventEmitter<ClipEvent>();
  @Output() readyState$ = new EventEmitter<boolean>();
  api: VgAPI;
  showSlide = true;

  constructor(
    private timerService: TimerService,
    private applicationEventService: ApplicationEventService
  ) {
    applicationEventService.navigateTo$.subscribe((time: ClipEvent) => {
      this.navigateTo(time);
    });

    applicationEventService.sourceChanged$.subscribe((mediaSource: MediaSource) => {
      this.changeSource(mediaSource);
    });
  }

  ngOnInit() {
    console.info(`[VideoPlayer] Setting source`, this.source);

    let that = this;
    if (this.timer$) {
      console.info("[VideoPlayerComponent] subscribing to timer$");
      this.timer$.subscribe(codeEvent => {
        console.info("[VideoPlayerComponent] timer$: ", codeEvent);
        that.navigateTo(codeEvent);
      });
    }

    if (this.playState$) {
      console.info("[VideoPlayerComponent] subscribing to playState$");
      this.playState$.subscribe(playState => {
        console.info("[VideoPlayerComponent] playState$: ", playState);
        if (playState) {
          this.api.play();
        } else {
          this.api.pause();
        }
      });
    }
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
    console.info("[VideoPlayer]::onPlayerReady vg:loaded");

    this.readyState$.emit(true);

    this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(() => {
      const currentTime = this.api.currentTime;
      // console.info(`vg:currentTimeChanged ${currentTime}`);
      this.timerService.setTime(currentTime);
      this.currentTime$.emit(currentTime);
    });

    this.api.getDefaultMedia().subscriptions.durationChange.subscribe(() => {
      const duration = this.api.duration;
      console.info(`vg:durationChanged ${duration}`);
      this.applicationEventService.mediaLoaded({ duration: duration });
    });

    if (this.autoPlay) {
      api.play();
    }
  }

  changeSource(mediaSource: MediaSource) {
    // this.media(mediaSource.src, mediaSource.type);
    console.info(`vg:mediaChanged`);
  }

  navigateTo(time: ClipEvent): void {
    console.info(`vg:navigateTo `, time);
    this.api.currentTime = time.seconds;
  }

  seekForward(seconds: number) {
    this.api.currentTime += seconds;
  }
}
