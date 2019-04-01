import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {Content} from 'ionic-angular';
import {HTTP} from '@ionic-native/http';
import {Storage} from '@ionic/storage';
import {RegisterPage} from '../register/register';
import {AlertController} from 'ionic-angular';
import { AboutPage } from '../about/about'
import { App } from 'ionic-angular';
import { Events } from 'ionic-angular';

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
  url: any;
  @ViewChild(Content) content: Content;

  constructor(
    public storage: Storage,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HTTP,
    public alertCtrl: AlertController,
    public app: App,
    public events: Events
  ) {
    storage.get('urlApi').then((val) => {
      this.url = val;
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad LoginPage');
  }

  reg() {
    this.navCtrl.pop();
    this.navCtrl.push('RegisterPage');
  }

  presentAlert(title:string,msg:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['Ok']
    });
    alert.present();
  }


  loginForm() {
    this.http.post(this.url + '/post/login', {email: this.login["email"], password: this.login["password"]}, {})
      .then(data => {
        data = JSON.parse(data.data);
        if (data[0].uid > 0) {
          this.storage.set('uid', data[0].uid);
          this.storage.set('email', data[0].email);
          this.storage.set('name', data[0].name);
          this.events.publish('user:login');
          this.navCtrl.pop();
          this.app.getRootNav().setRoot(AboutPage);
        }


      })
      .catch(error => {
        this.presentAlert("ไม่สามารถเข้าสู่ระบบได้","กรุณาตรวจสอบข้อมูลให้ถูกต้อง");
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

      });
  }
}
