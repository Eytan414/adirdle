export interface Highscores{
  name: string,
  words5: {
    games: number,
    average: number,
    details: number[]
  },
  words6: {
    games: number,
    average: number,
    details: number[]
  }
}