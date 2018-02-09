import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { VgAPI } from "videogular2/core";
import { TimerService, ApplicationEventService } from "../../services";
import { Observable } from "rxjs/Observable";
import { MediaSource } from "../../models";

@Component({
  selector: "video-player",
  template: `
    <vg-player (onPlayerReady)="onPlayerReady($event)">
      <vg-overlay-play></vg-overlay-play>
      <vg-buffering></vg-buffering>

      <vg-scrub-bar>
          <vg-scrub-bar-current-time  [vgSlider]="true"></vg-scrub-bar-current-time>
          <vg-scrub-bar-buffering-time></vg-scrub-bar-buffering-time>
      </vg-scrub-bar>

      <vg-controls [vgAutohide]="true" [vgAutohideTime]="4"> 

          <vg-play-pause></vg-play-pause>
          <vg-playback-button></vg-playback-button>

          <div class="seek-control fa fa-clock-o">
            <span aria-label="seek forward" class="seek-button button" role="button" tabindex="0" aria-valuetext="1"  (click)="seekForward(-5)">
            <i class="material-icons">replay_5</i>
            </span>
          </div>
          <div class="seek-control fa fa-clock-o">
            <span aria-label="seek forward" class="seek-button button" role="button" tabindex="0" aria-valuetext="1"  (click)="seekForward(5)">
              <i class="material-icons">forward_5</i>
            </span>
          </div>

          <vg-time-display vgProperty="current" vgFormat="mm:ss"></vg-time-display>

          <vg-scrub-bar style="pointer-events: none;"></vg-scrub-bar>
          
          <vg-track-selector></vg-track-selector>
          <vg-mute></vg-mute>
          <vg-volume></vg-volume>

          <vg-fullscreen></vg-fullscreen>
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
  @Input() timer$: Observable<number>;
  @Input() playState$: Observable<boolean>;
  @Input() autoPlay: boolean = false;

  @Output() currentTime$ = new EventEmitter<number>();
  @Output() readyState$ = new EventEmitter<boolean>();
  api: VgAPI;
  showSlide = true;

  constructor(
    private timerService: TimerService,
    private applicationEventService: ApplicationEventService
  ) {
    applicationEventService.navigateTo$.subscribe((time: number) => {
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

  navigateTo(time: number): void {
    this.api.currentTime = time;
    console.info(`vg:navigateTo ${time}`);
  }

  seekForward(seconds: number) {
    this.api.currentTime += seconds;
  }
}
