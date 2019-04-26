import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, LoadingController, ModalController} from 'ionic-angular';
import {DatePicker} from '@ionic-native/date-picker';
import {HTTP} from '@ionic-native/http';
import {Storage} from '@ionic/storage';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import {Platform, ActionSheetController} from 'ionic-angular';

import {HomePage} from "../home/home";


/**
 * Generated class for the AddItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-item',
  templateUrl: 'add-item.html',
})
export class AddItemPage {
  tzoffset = (new Date()).getTimezoneOffset() * 60000;
  minDate: string = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0, -1);
  dateExp: string = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0, -1);
  dateYellow: string = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0, -1);
  rid: any;
  url: any;
  uid: any;
  key: any;
  itemForm = {};
  pv_key_old = null;
  myPhoto = "assets/imgs/add-photo.png";
  oldPhoto: any;
  id_noti_red: any;
  method = 0;
  options = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'};

  constructor(
    private localNotifications: LocalNotifications,
    public navCtrl: NavController,
    public params: NavParams,
    public viewCtrl: ViewController,
    private datePicker: DatePicker,
    public storage: Storage,
    public http: HTTP,
    public camera: Camera,
    private transfer: FileTransfer, private file: File,
    private loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public modalCtrl: ModalController
  ) {
    storage.get('urlApi').then((val) => {
      this.url = val;
    });
    this.getData();

  }

  getData() {
    this.storage.get('uid').then((val) => {
      this.uid = val;
      this.http.get(this.url + "/myDevice/" + val, {}, {})
        .then(data => {
          this.key = JSON.parse(data.data);
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

  showMyDevice() {
    const modal = this.modalCtrl.create(HomePage, {modelCheck: true});
    modal.present();
    modal.onDidDismiss(() => {
      this.doRefresh(null);
    });
  }

  ionViewDidLoad() {
    this.storage.get('urlApi').then((val) => {
      this.url = val;
      if (this.params.get('refrig_id'))
        this.rid = this.params.get('refrig_id');
      if (this.params.get('data')) {
        let oldData = this.params.get('data');
        this.itemForm["name"] = oldData.name;
        this.pv_key_old = oldData.private_key;
        this.itemForm["pvkey"] = oldData.private_key;
        this.oldPhoto = val + "/" + oldData.image;
        this.myPhoto = val + "/" + oldData.image;
      }
    });
    this.method = this.params.get('method');
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'ถ่ายรูปภาพ',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePhoto();
          }
        }, {
          text: 'เลือกรูปภาพจากคลัง',
          icon: !this.platform.is('ios') ? 'photos' : null,
          handler: () => {
            this.getPhoto();
          }
        }, {
          text: 'ยกเลิก',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.myPhoto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  getPhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.myPhoto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  doRefresh(refresher) {
    let loader = this.loadingCtrl.create({
      content: "รอสักครู่"
    });
    loader.present();
    setTimeout(() => {
      this.minDate = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0, -1);
      this.getData();
      loader.dismiss();
      refresher.complete();
    }, 2000);

  }

  addForm() {
    // console.log("rid: "+this.rid+" name: "+this.itemForm["name"]+" datetime: "+this.dateExp+" datetimeYellow: "+this.dateYellow+" private_key: "+this.itemForm["pvkey"]);
    let loader = this.loadingCtrl.create({
      content: "กำลังอัพโหลด"
    });
    loader.present();

    this.http.post(this.url + '/refrigerator/addItem', {
      id: this.rid,
      name: this.itemForm["name"],
      datetime: this.dateExp,
      datetimeYellow: this.dateYellow,
      private_key: this.itemForm["pvkey"]
    }, {})
      .then(data => {
        if (this.oldPhoto != this.myPhoto)
          this.uploadImage(this.itemForm["pvkey"], loader);
        else
          loader.dismiss();

        this.noti();
        this.dismiss();
      })
      .catch(error => {
        alert("Error Add Item.");
        loader.dismiss();
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

      });
  }

  uploadImage(pv_key: any, loader: any) {
    //create file transfer object
    const fileTransfer: FileTransferObject = this.transfer.create();


    //option transfer
    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: pv_key + "_" + Date.now() + ".jpg",
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: "image/jpeg",
      headers: {}
    }

    //file transfer action
    fileTransfer.upload(this.myPhoto, this.url + '/add/image/' + pv_key, options)
      .then((data) => {
        alert("Success");
        loader.dismiss();
        this.doRefresh(null);
      }, (err) => {
        console.log(err);
        alert("Error Add Image.");
        loader.dismiss();
      });
  }

  noti() {
    console.log("noti");
    //method add
    this.http.get(this.url + '/get/notification/' + this.itemForm["pvkey"], {}, {})
      .then(data => {
        data = JSON.parse(data.data);
        console.log(data[0]["noti_yellow"]);
        console.log(data[0]["noti_red"]);
        console.log(data[0]["dateTimeYellow"]);
        console.log(data[0]["dateTime"]);
        if (this.method == 1) {
          this.localNotifications.schedule({
            id: data[0]["noti_yellow"],
            title: 'Exprefrig : แจ้งเตือนสถานะ',
            text: this.itemForm["name"] + ' ใกล้หมดอายุ!!!',
            trigger: {at: new Date(data[0]["dateTimeYellow"])},
          });
          this.localNotifications.schedule({
            id: data[0]["noti_red"],
            title: 'Exprefrig : แจ้งเตือนสถานะ',
            text: this.itemForm["name"] + ' หมดอายุ!!!',
            trigger: {at: new Date(data[0]["dateTime"])},
          });
        }
        else {
          this.localNotifications.cancel(data[0]["noti_yellow"]).then();
          this.localNotifications.cancel(data[0]["noti_red"]).then();
          this.localNotifications.schedule({
            id: data[0]["noti_yellow"],
            title: 'Exprefrig : แจ้งเตือนสถานะ',
            text: this.itemForm["name"] + ' ใกล้หมดอายุ!!!',
            trigger: {at: new Date(data[0]["dateTimeYellow"])},
          });
          this.localNotifications.schedule({
            id: data[0]["noti_red"],
            title: 'Exprefrig : แจ้งเตือนสถานะ',
            text: this.itemForm["name"] + ' หมดอายุ!!!',
            trigger: {at: new Date(data[0]["dateTime"])},
          });
        }

      })
      .catch(error => {
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
      });
  }
}
