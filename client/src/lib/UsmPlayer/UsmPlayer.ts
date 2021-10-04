export default class UsmPlayer {
  play(audioUrl: string): void {
    console.log(`playing... ${audioUrl}`);
  }

  stop(): void {
    console.log('stopped');
  }
}
