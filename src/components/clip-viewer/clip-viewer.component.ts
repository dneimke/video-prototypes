import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { MediaSource, ClipEvent } from "../../models";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "clip-viewer",
  templateUrl: "./clip-viewer.component.html",
  styleUrls: ["./clip-viewer.component.css"]
})
export class ClipViewerComponent implements OnInit {
  @Input() clips: ClipEvent[];
  @Input() source: MediaSource;
  @Input() displayName: string;
  @Input() clipShortName?: string;
  @Input() playlistId?: string;
  @Input() showClose: boolean;

  @Output() closeClipViewer = new EventEmitter();
  @Output() sharePlaylist = new EventEmitter();

  selectedIndex;
  selectedClip: ClipEvent;
  timer$ = new Subject<ClipEvent>();
  playState$ = new Subject<boolean>();
  showShare: boolean;
  shareUrl: string;

  constructor(router: Router) {}

  ngOnInit(): void {
    this.clips = this.clips.sort(
      (clipA: ClipEvent, clipB: ClipEvent) => clipA.seconds - clipB.seconds
    );

    this.selectedClip = this.clips[0];
    console.info("[ClipViewer] init", this.clips, this.selectedClip);

    if (this.playlistId) {
      this.shareUrl = `/playlist/${this.playlistId}`;
      this.showShare = true;
    }
  }

  getClipname(clip: ClipEvent): string {
    if (this.clipShortName) return this.clipShortName;

    return `${clip.seconds.toString()} seconds`;
  }

  onCurrentTimeChange(currentTime: number) {
    if (this.clips.length > 0) {
      const lower = this.selectedClip.seconds - 5;
      const upper = this.selectedClip.seconds + 5;
      let tempIndex = this.selectedIndex;
      let stop = false;

      // console.info("[ClipViewer] onCurrentTimeChange", currentTime, lower, upper, tempIndex, stop);
      if (currentTime > upper) {
        // console.info(`[ClipViewerComponent] ${currentTime} > ${upper}`);
        if (tempIndex < this.clips.length - 1) {
          tempIndex++;
        } else {
          stop = true;
        }
      } else if (currentTime < lower) {
        // console.info(`[ClipViewerComponent] ${currentTime} < ${lower}`);
        if (tempIndex > 0) {
          tempIndex--;
        }
      }

      if (stop) {
        this.playState$.next(false);
      } else if (tempIndex !== this.selectedIndex) {
        this.selectedIndex = tempIndex;
        this.navigateTo(this.clips[this.selectedIndex], this.selectedIndex);
      }
    }
  }

  onMediaReadyState(readyState: boolean) {
    if (this.selectedIndex) {
      this.navigateTo(this.selectedClip);
    } else {
      let that = this;
      this.selectedIndex = 0;
      setTimeout(function() {
        // workaround for loading contention issue - refer: https://github.com/dneimke/coding-tool/issues/41
        that.navigateTo(that.selectedClip);
      }, 1000);
    }
  }

  navigateTo(clip: ClipEvent, index: number = 0) {
    const clipEvent: ClipEvent = {
      seconds: clip.seconds,
      isPlaying: clip.isPlaying
    };

    console.info("[ClipViewerComponent] navigating: ", clipEvent);
    this.selectedClip = clip;
    this.selectedIndex = index;
    this.timer$.next(clipEvent);
    this.playState$.next(true);
  }

  close() {
    this.closeClipViewer.emit();
  }

  share() {
    if (this.shareUrl) {
      prompt("Here is the sharing Url for this playlist", this.shareUrl);

      // var copyEvent = new ClipboardEvent("copy", {
      //   dataType: "text/plain",
      //   data: this.shareUrl
      // });
      // document.dispatchEvent(copyEvent);

      // alert('')
      this.sharePlaylist.emit();
    }
  }
}
