// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const ENV = {
  production: false,
  releaseDate: '2022-04-04',
  firebaseConfig: {
    apiKey: "AIzaSyCgNqnJ-9hr2cWHi6FJAKgGMdWX15WSsXE",
    authDomain: "dirdle.firebaseapp.com",
    projectId: "dirdle",
    messagingSenderId: "225389761581",
    appId: "1:225389761581:web:611994f305b1c5deb114a4",
    measurementId: "G-76N30BEMTE",
    databaseURL: "https://dirdle-default-rtdb.europe-west1.firebasedatabase.app/"
  },
  emailJsConfig: {
    "serviceId": "service_y9g6aia",
    "templateId": "template_90wg4si",
    "publicKey": "Fzr4Ahy2pjzqZOMQy"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
