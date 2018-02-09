import { Subject } from "rxjs";

export class TimerService {
  private currentTime = 0;
  private formattedTime = "";

  // Observable source
  public onTimeChange = new Subject<number>();

  public getTime(): number {
    console.info("[TimerService] getTime: ", this.currentTime);
    return this.currentTime;
  }

  public setTime(time: number) {
    if (time) {
      // console.info("[TimerService] setTime: ", time);
      this.currentTime = time;
      this.onChange(time);
    }
  }

  public onChange(currentTime: number) {
    this.onTimeChange.next(currentTime);
  }
}