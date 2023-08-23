import { Highscores as Highscore } from "./models/Highscores";

export const RECORDS_DB_KEY:string = 'users';
export const USERNAME_KEY:string = 'username';
export const ANIMATION_LENGTH:number = 750;
export const fireworksOptions:any =  {
    autoresize: true,
    opacity: 0.6,
    acceleration: 1,
    friction: 0.97,
    gravity: 1.5,
    particles: 50,
    traceLength: 3,
    traceSpeed: 8,
    explosion: 5,
    intensity: 30,
    flickering: 50,
    lineStyle: 'round',
    hue: {
      min: 0,
      max: 360
    },
    delay: {
      min: 3,
      max: 60
    },
    rocketsPoint: {
      min: 50,
      max: 50
    },
    lineWidth: {
      explosion: {
        min: 1,
        max: 3
      },
      trace: {
        min: 1,
        max: 2
      }
    },
    brightness: {
      min: 50,
      max: 80
    },
    decay: {
      min: 0.015,
      max: 0.03
    },
    mouse: {
      click: false,
      move: false,
      max: 1
    }
};

export const respnoses:string[][] = [
  [
    "AMAZING!!!🏆",
    "WOW! WOW!! WOW!!!😲"
  ],
  [
    "INCREDIBLE!!!💯" ,
    "ASTONISHING🥇"
  ],
  [
    "Impressive✌️" ,
    "Wonderful🙌",
    "Nailed it🤩",
  ],
  [
    "Nice!",
    "Very good👍",
    "Done👌",
    "Good job😎"
  ]
];

export const emptyEntry:Highscore = {
  name: '',
  words5: {
    games:0, 
    average:0,
    details: []
  },
  words6: {
    games:0, 
    average:0,
    details: []
  },
};