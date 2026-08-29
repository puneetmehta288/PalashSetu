export class AudioService {
  play(url: string) {
    const audio = new Audio(url);
    audio.play();
  }
}
export const audioService = new AudioService();
