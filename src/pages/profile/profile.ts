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
      this.getProfile();
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getProfile();
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

  getProfile() {
    this.http.post('http://192.168.137.1/get/user', {uid:this.uid,auth:"2y$12$ZOwD7oZr.jUt7f7YnVxdy.v4P8KDajFq17ueQT1Arw9QjHsS96x3q"}, {})
      .then(data => {
        data = JSON.parse(data.data);
        console.log("data : "+data);
        this.data = data;

      })
      .catch(error => {

        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

      });
  }

}
