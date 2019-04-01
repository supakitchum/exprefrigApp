import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {Content} from 'ionic-angular';
import { LoginPage } from '../login/login';
import {HTTP} from '@ionic-native/http';
import {Storage} from '@ionic/storage';
import {AlertController} from 'ionic-angular';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  @ViewChild(Content) content: Content;
  data = {};
  url:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: HTTP,
              public storage: Storage,
              public alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    this.storage.get('urlApi').then((val) => {
      this.url = val;
    });
  }

  registerForm(){
    if (this.data["password"] == this.data["repassword"]) {
      this.http.post(this.url + '/post/register', {auth:"0fa2e78f70d377d5da274ebd4e8b5e1c",name:this.data["name"],email: this.data["email"], password: this.data["password"]}, {})
        .then(data => {
          this.presentAlert("สำเร็จ","ขอบคุณที่ใช้บริการจากเรา");
          this.navCtrl.push('LoginPage');
        })
        .catch(error => {
          this.presentAlert("ไม่สามารถสมัครสมาชิกได้","อาจมีผู้ใช้อีเมลล์นี้แล้ว หรือ กรอกข้อมูลไม่ครบถ้วน");
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);

        });
    }
    else {
      this.presentAlert("ยืนยันรหัสผ่านผิด","กรุณาใส่รหัสผ่านและยืนยันรหัสผ่านให้ตรงกัน");
    }
  }

  presentAlert(title:string,msg:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['Ok']
    });
    alert.present();
  }

}
