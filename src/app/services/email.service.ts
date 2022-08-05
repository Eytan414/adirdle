import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { ENV } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  sendEmail(action: string, word: string, average: string) {
    emailjs.send(ENV.emailJsConfig.serviceId,
      ENV.emailJsConfig.templateId,
      {"action": action, "word": word, "average": average}, 
      ENV.emailJsConfig.publicKey
    ).then((result: EmailJSResponseStatus) => {
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });

  }
}
