import { Component, OnInit } from "@angular/core";
import { ClipEvent, MediaSource } from "../../models";

@Component({
  selector: "view-clips",
  template: `
    <div style="text-align:center">
        <h1>{{title}}!</h1>
    </div>

    <div class='container' style='margin-top: 58px'>
        <clip-viewer [source]='media' [clips]='clips' [displayName]='displayName'></clip-viewer>
    </div>
    `,
  styles: []
})
export class ViewClipsComponent implements OnInit {
  title = "Clips Viewer";
  displayName = "Clips";
  media: MediaSource;
  clips: ClipEvent[];

  constructor() {}

  ngOnInit(): void {
    this.media = {
      src:
        "https://codingtoolproto.blob.core.windows.net/asset-ba8ecd34-d730-4966-9f85-9f4b113b22e7/R9_GRGvAHC_FullGame.mp4?sv=2015-07-08&sr=c&si=baf99b1f-e9f3-456a-aa48-1ed66060be6d&sig=UCEqEhJaE6Uohy%2BxFjrB7vT39XCV60%2FWp%2FSHeBqPbLE%3D&st=2017-12-06T03%3A08%3A54Z&se=2117-12-06T03%3A08%3A54Z",
      type: "video/mp4"
    };

    this.clips = [
      { isPlaying: false, seconds: 120 },
      { isPlaying: false, seconds: 240 },
      { isPlaying: false, seconds: 520 },
      { isPlaying: false, seconds: 700 },
      { isPlaying: false, seconds: 1200 }
    ];
  }
}
