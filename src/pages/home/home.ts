import { Component } from '@angular/core';
import {ActionSheetController, NavController, ViewController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import { ModalController, NavParams } from 'ionic-angular';
import { WifiscannerPage } from '../wifiscanner/wifiscanner';

import { LoadingController } from "ionic-angular";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  url:any;
  data = '';
  uid = 0;
  modelCheck:boolean = false;
  devices:any = [{"private_key":null}];
  timeoutHandler: any;
  count = 0;
  constructor
  (
    public modalCtrl: ModalController,
    public http: HTTP,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public storage: Storage,
    public viewCtrl: ViewController,
    public params: NavParams,
    private loadingCtrl:LoadingController,
    public actionSheetCtrl: ActionSheetController){
    storage.get('urlApi').then((val) => {
      this.url = val;
      if (this.params.get('modelCheck')){
        this.modelCheck = this.params.get('modelCheck');
      }
    });
    this.getUid();
  }

  getDevice(){
    this.http.get(this.url + "/get/all/myDevice/"+this.uid,{},{})
      .then(key=>{
        this.devices = JSON.parse(key.data)
      })
  }

  showAlert(str1:string,str2:string) {
    const alert = this.alertCtrl.create({
      title: str1,
      subTitle: str2,
      buttons: ['OK']
    });
    alert.present();
  }

  getUid(){
    this.storage.get('uid').then((val) => {
      this.uid = val;
      this.getDevice();
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

  presentActionSheet(key:any) {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'ลบ',
          icon: 'trash',
          handler: () => {
            this.delete(key);
          }
        }
      ]
    });
    actionSheet.present();
  }

  holdCount(pv_key:any) {
    this.timeoutHandler = setInterval(() => {
      if (this.count == 2) {
        this.presentActionSheet(pv_key);
        clearTimeout(this.timeoutHandler);
        this.timeoutHandler = null;
        this.count = 0;
      }
      ++this.count;
    }, 200);

  }

  doPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'บันทึกอุปกรณ์',
      message: "โปรดกรอกรหัสประจำอุปกรณ์ลงในช่องด้านล่าง",
      inputs: [
        {
          name: 'pv_key',
          placeholder: 'รหัสประจำอุปกรณ์'
        },
      ],
      buttons: [
        {
          text: 'ยกเลิก',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'ลงทะเบียนอุปกรณ์',
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
    this.storage.get('uid').then((val) => {
      this.http.put(this.url + "/activated", {pv_key:pv_key,status:"yes",uid:val}, {})
        .then(data => {
          console.log(data.data);
          if (data.data == 1){
            this.showAlert('Actived','ลงทะเบียนสำเร็จ');
            this.doRefresh(null);
          }
          else
            this.showAlert('Fail','ไม่พบรหัสนี้ในฐานข้อมูล หรือ อุปกรณ์นี้ถูกลงทะเบียนไปแล้ว');
        })
        .catch(error => {
          this.showAlert('Fail','ไม่พบรหัสนี้ในฐานข้อมูล หรือ อุปกรณ์นี้ถูกลงทะเบียนไปแล้ว');
        });
      // this.pushPage = LoginPage;
      // this.params = { id: 42 };
    });
  }

  doRefresh(refresher) {
    this.getDevice();
    let loader = this.loadingCtrl.create({
      content: "รอสักครู่"
    });
    loader.present();
    setTimeout(() => {
      loader.dismiss();
      refresher.complete();
    }, 2000);

  }

  delete(key:string){
    this.http.delete(this.url + "/delete/device/"+key,{},{})
      .then(val=>{
        this.doRefresh(null);
      })
  }
}


