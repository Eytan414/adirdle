import { StorageService } from 'src/app/services/storage.service';
import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { ENV } from '../../environments/environment';
import { USERNAME_KEY } from '../constants';
@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private storageService:StorageService) { }

  sendEmail(action: string, word: string) {
    const username = this.storageService.loadFromLocalStorage(USERNAME_KEY);
    emailjs.send(ENV.emailJsConfig.serviceId,
      ENV.emailJsConfig.templateId,
      {"action": action, "word": word, "average": username}, 
      ENV.emailJsConfig.publicKey
    ).then((result: EmailJSResponseStatus) => {
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });

  }
}
