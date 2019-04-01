import {Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HTTP} from '@ionic-native/http';
import {Storage} from '@ionic/storage';
import {ItemDetailPage} from '../item-detail/item-detail';
import {AddItemPage} from "../add-item/add-item";
import {ModalController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';

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
  url: any;
  data = '';
  count = 0;
  timeoutHandler: any;
  hold: boolean = false;
  options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  constructor(
    public storage: Storage,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HTTP,
    public modalCtrl: ModalController,
    public camera: Camera,
    public actionSheetCtrl: ActionSheetController
  ) {
    storage.get('urlApi').then((val) => {
      this.url = val;
    });
    this.id = navParams.get('id');
    this.name = navParams.get('name');
    this.getData();
  }

  getData() {
    this.storage.get('uid').then((val) => {
      this.http.get(this.url + "/get/app/device/uid=" + val + "&rid=" + this.id, {}, {})
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

  parentPage(id: string, name: string) {
    this.navCtrl.push(ItemDetailPage, {
      pv_key: id,
      name: name
    });
  }

  holdCount(id:any,pv_key:any) {
    this.hold = true;
    this.timeoutHandler = setInterval(() => {
      if (this.count == 2) {
        this.presentActionSheet(id,pv_key);
        this.endCount(null, null);
      }
      ++this.count;
    }, 200);

  }

  endCount(private_key: any, name: any) {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
      this.count = 0;
    }
    if (!this.hold) {
      this.parentPage(private_key, name);
    }
  }

  presentActionSheet(id:any,key:any) {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'แก้ไข',
          icon: 'create',
          handler: () => {
            this.presentModalEdit(id);
            this.hold = false;
          }
        }, {
          text: 'ลบ',
          icon: 'trash',
          handler: () => {
            this.deleteItem(key)
            this.hold = false;
          }
        }, {
          text: 'ยกเลิก',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
            this.hold = false;
          }
        }
      ]
    });
    actionSheet.present();
  }

  presentModalAdd() {
    const modal = this.modalCtrl.create(AddItemPage, {refrig_id: this.id, method: 1});
    modal.present();
    modal.onDidDismiss(() => {
      this.doRefresh(null);
    });
  }

  presentModalEdit(id: any) {
    const modal = this.modalCtrl.create(AddItemPage, {refrig_id: this.id, data: this.data[id], method: 0});
    modal.present();
    modal.onDidDismiss(() => {
      this.doRefresh(null);
    });

  }

  deleteItem(pv_key: any) {
    this.http.post(this.url + '/rm/item', {private_key: pv_key}, {})
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
