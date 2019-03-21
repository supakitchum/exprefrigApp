import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {Storage} from '@ionic/storage';


import {LoginPage} from '../login/login';
import {RegisterPage} from '../register/register';
import {HTTP} from "@ionic-native/http";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  uid: any;
  url:any;
  data:any;
  constructor(public navCtrl: NavController, private statusBar: StatusBar, public storage: Storage,public http: HTTP) {
    this.storage.get('uid').then((val) => {
      this.uid = val;
      this.getProfile(val);
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getProfile(this.uid);
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  reg() {
    this.navCtrl.push('RegisterPage');
  }

  getProfile(uid:any) {
    this.http.post('http://192.168.137.1/get/user', {uid:uid,auth:"0fa2e78f70d377d5da274ebd4e8b5e1c"}, {})
      .then(data => {
        data = JSON.parse(data.data);
        console.log(data[0]);
        this.data = data[0];

      })
      .catch(error => {

        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

      });
  }

  logout(){
    this.storage.remove('uid');
    this.doRefresh(null);
  }


}
