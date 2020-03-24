import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { NgForm } from '@angular/forms';

import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // setup your signautre endpoint here: https://github.com/zoom/websdk-sample-signature-node.js
  signatureEndpoint = 'https://na-conference.herokuapp.com/api/zoom/signature';
  apiKey = 'N4AyKlmIQGi_Nsw4cXFtlw';
  meetingNumber = '814584950';
  role = 0;
  leaveUrl = 'https://na-conference.firebaseapp.com/';
  userName = '';
  userEmail = '';
  passWord = '';

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document) {

  }

  ngOnInit() {

  }

  getSignature() {
    //const headers = new HttpHeaders().append("Accepts", "text/plain");
    this.httpClient.post(this.signatureEndpoint, {
      meetingNumber: this.meetingNumber,
      username: this.userName
    })
      .toPromise().then((data: any) => {
      if(data) {
        console.log(data)
        this.startMeeting(data.signature)
      } else {
        console.log(data)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  startMeeting(signature) {

    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: this.leaveUrl,
      isSupportAV: true,
      success: (success) => {
        console.log(success)

        ZoomMtg.join({
          signature: signature,
          meetingNumber: this.meetingNumber,
          userName: this.userName,
          apiKey: this.apiKey,
          userEmail: this.userEmail,
          passWord: this.passWord,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
