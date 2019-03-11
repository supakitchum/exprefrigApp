import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import { ModalController, NavParams } from 'ionic-angular';
import { WifiscannerPage } from '../wifiscanner/wifiscanner';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  url:any;
  data = '';
  uid = 0;
  constructor
  (
    public modalCtrl: ModalController,
    public http: HTTP,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public storage: Storage){
    storage.get('urlApi').then((val) => {
      this.url = val;
    });
    this.getUid();
    if (this.uid == 0){
      this.navCtrl.parent.select(2);
    }
  }
  showAlert(str1:string,str2:string) {
    const alert = this.alertCtrl.create({
      title: str1,
      subTitle: str2,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {
    if( typeof( this.uid ) !== "undefined" || this.uid == 0){
      this.navCtrl.parent.select(2);
    }
    console.log('ionViewDidLoad ItemPage');
  }

  getUid(){
    this.storage.get('uid').then((val) => {
      this.uid = val;
    });
  }

  login(){
    this.getUid();
    if(this.uid == 0){
      return false;
    }
    return true;
  }

  presentModal() {
    const modal = this.modalCtrl.create(WifiscannerPage);
    modal.present();
  }

  doPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'บันทึกอุปกรณ์',
      message: "โปรดกรอก Private_key ของอุปกรณ์ลงในช่องด้านล่าง",
      inputs: [
        {
          name: 'pv_key',
          placeholder: 'Private key'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Active',
          handler: data => {
            console.log('Saved clicked');
            this.actived(data.pv_key);
          }
        }
      ]
    });
    prompt.present();
  }

  actived(pv_key:string){
    this.url += "/put/board_factory/"+ pv_key;
    this.storage.get('uid').then((val) => {
      this.url += "?status=yes&uid="+val;
      this.http.put(this.url, {}, {})
        .then(data => {
          console.log(data.data);
          if (data.data == 1)
            this.showAlert('Actived','ลงทะเบียนสำเร็จ');
          else
            this.showAlert('Fail','ไม่พบรหัสนี้ในฐานข้อมูล');
        })
        .catch(error => {

          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);

        });
      // this.pushPage = LoginPage;
      // this.params = { id: 42 };
    });
  }
}


