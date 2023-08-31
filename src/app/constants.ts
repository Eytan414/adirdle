import { Highscores as Highscore } from "./models/Highscores";

export const RECORDS_DB_KEY:string = 'users';
export const USERNAME_KEY:string = 'username';
export const ANIMATION_LENGTH:number = 750;
export const fireworksOptions:any =  {
    autoresize: true,
    sound:{
      enabled: true,
      files: [
        '../assets/sounds/explosion0.mp3',
        '../assets/sounds/explosion1.mp3',
        '../assets/sounds/explosion2.mp3'
      ],
      volume: {
        min: 3,
        max: 9
      }
    },
    opacity: 0.6,
    acceleration: 1,
    friction: 0.97,
    gravity: 2,
    particles: 33,
    traceLength: 4,
    traceSpeed: 8,
    explosion: 9,
    intensity: 1,
    flickering: 50,
    lineStyle: 'round',
    hue: {
      min: 0,
      max: 360
    },
    delay: {
      min: 1,
      max: 20
    },
    rocketsPoint: {
      min: 22,
      max: 55
    },
    lineWidth: {
      explosion: {
        min: 3,
        max: 9
      },
      trace: {
        min: 1,
        max: 9
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
    "INSANE!!!🤯",
    "WOW! WOW!! WOW!!!😲",
    "Did you cheat??!🎯",
  ],
  [
    "INCREDIBLE!!!💯" ,
    "Outstanding!!! 🔥" ,
    "ASTONISHING🥇",
    "Did you cheat??🎯",
  ],
  [
    "Impressive💥" ,
    "Professional🎆",
    "Fantastic💫",
    "Terrific 🚀",
    "Delightful🤩",
  ],
  [
    "Wonderful🙌",
    "Nailed it🤙",
    "Very good👏",
    "Good job😎"
  ],
  [
    "Nice👍",
    "Good🤘",
    "Success✌️",
    "Done👌",
  ],
  [
    "Not bad",
    "Don't worry about it🤞",
    "Practice makes perfect💪",
    "Hang in there🤞",
    "Stay strong💪",
    "Never give up💪",
  ],
  [
    "Really?!",
    "Shhhhhh🤫",
    "Is it your first game?",
    "Embarrassing...",
    "You can do better",
    "At least you got it",
  ]
];

export const emptyEntry:Highscore = {
  name: '',
  words5: {
    games:0, 
    average:0,
    details: [,]
  },
  words6: {
    games:0, 
    average:0,
    details: [,]
  },
};