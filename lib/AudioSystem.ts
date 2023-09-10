export interface IAudio
{
  play(): void;
  loop(): void;
  stop(): void;
}

export interface AudioSystemProps {
    fileName: string;
    channels?: number;
    volume?: number;
};

export class AudioSystem implements IAudio
{
  private sounds = new Array<HTMLAudioElement>();
  private channels: number;
  private volume: number;
  private index = 0;

  constructor(props: AudioSystemProps) 
  {
    this.channels = props.channels ?? 4;
    this.volume = props.volume ?? 1;

    for (let i = 0; i < this.channels; i++)
    {
      if (typeof Audio !== "undefined") {
        this.sounds.push(new Audio(props.fileName));
      }
    }
  }

  play() 
  {
    if (this.sounds.length === 0) {
        return;
    }

    this.sounds[this.index].volume = this.volume;
    this.sounds[this.index].play();

    this.index = (this.index + 1) % this.channels;
  }

  loop() 
  {
    if (this.sounds.length === 0) {
        return;
    }

    this.sounds[this.index].volume = this.volume;
    this.sounds[this.index].loop = true;
    this.sounds[this.index].play();
  }

  stop()
  {
    if (this.sounds.length === 0) {
        return;
    }

    for (const item of this.sounds)
    {
      item.pause();
      item.currentTime = 0;
    }
  }
}
