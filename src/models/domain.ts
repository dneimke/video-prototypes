// a message that is sent when the video player media has loaded
export interface MediaLoadedEvent {
  duration: number;
}

// data representing the media source
export class MediaSource {
  src: string;
  type: string;
}

export class ClipEvent {
  isPlaying = false;
  constructor(public seconds: number) {}
}
