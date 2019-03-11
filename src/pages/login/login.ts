import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import { AboutPage } from '../about/about';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
    login = {};
    pushPage: any;
    url:any;
    @ViewChild(Content) content: Content;
    constructor(public storage: Storage,public navCtrl: NavController, public navParams: NavParams,public http: HTTP) {
      storage.get('urlApi').then((val) => {
        this.url = val;
      });
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad LoginPage');
    }


    loginForm() {
        this.http.post(this.url+'/post/login', {username:this.login["email"],password:this.login["password"]}, {})
        .then(data => {
            data = JSON.parse(data.data);
            if (data[0].uid > 0) {
                this.storage.set('uid', data[0].uid);
                this.navCtrl.parent.select(1); 
            }


        })
        .catch(error => {

        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

        });
    }
}
