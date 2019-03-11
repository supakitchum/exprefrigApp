import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import { ItemDetailPage } from '../item-detail/item-detail';
import {  AddItemPage } from "../add-item/add-item";
import { ModalController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the ItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-item',
  templateUrl: 'item.html',
})
export class ItemPage {
  id = '';
  name = '';
  url:any;
  data = '';
  constructor(
    public storage: Storage,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HTTP,
    public modalCtrl:ModalController,
    public camera: Camera
  )
  {
    storage.get('urlApi').then((val) => {
      this.url = val;
    });
    this.id = navParams.get('id');
    this.name = navParams.get('name');
    this.getData();
  }

  getData(){
    this.storage.get('uid').then((val) => {
      this.http.get(this.url+"/get/app/device/uid="+val+"&rid="+this.id, {}, {})
        .then(data => {
          this.data = JSON.parse(data.data);
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

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getData();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  ionViewDidLoad() {

  }

   parentPage(id:string,name:string){
    this.navCtrl.push(ItemDetailPage, {
      id: id,
      name: name
    });
  }

  presentModalAdd() {
    const modal = this.modalCtrl.create(AddItemPage,{ refrig_id: this.id,method:1 });
    modal.present();
    modal.onDidDismiss(() =>{
      this.doRefresh(null);
    });
  }

  presentModalEdit() {
    const modal = this.modalCtrl.create(AddItemPage,{ refrig_id: this.id ,data: this.data[0],method:0 });
    modal.present();
    modal.onDidDismiss(() =>{
      this.doRefresh(null);
    });

  }

  deleteItem(){
    this.http.post(this.url+'/rm/item', {private_key:this.data[0]["private_key"]}, {})
      .then(data => {
        this.doRefresh(null);
      })
      .catch(error => {

        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

      });
  }
}
