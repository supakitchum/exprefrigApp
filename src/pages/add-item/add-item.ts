import { Component } from '@angular/core';
import {NavController, NavParams, ViewController,LoadingController} from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Platform , ActionSheetController } from 'ionic-angular';



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
  dateExp:any;
  dateYellow:any;
  rid:any;
  url:any;
  uid:any;
  key:any;
  itemForm = {};
  myPhoto = "assets/imgs/add-photo.png";
  oldPhoto:any;
  id_noti_red:any;
  method = 0;

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
    private loadingCtrl:LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform

  ){
    storage.get('urlApi').then((val) => {
      this.url = val;
    });
    this.storage.get('uid').then((val) => {
      this.uid = val;
      this.http.get(this.url+"/myDevice/"+val, {}, {})
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

  ionViewDidLoad() {
    this.storage.get('urlApi').then((val) => {
      this.url = val;
      if(this.params.get('refrig_id'))
        this.rid = this.params.get('refrig_id');
      if(this.params.get('data')){
        let oldData = this.params.get('data');
        this.itemForm["name"] = oldData.name;
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
        },{
          text: 'เลือกรูปภาพจากคลัง',
          icon: !this.platform.is('ios') ? 'photos' : null,
          handler: () => {
            this.getPhoto();
          }
        },{
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

  takePhoto(){
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

  getPhoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
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
    if(refresher !== null){
      setTimeout(() => {
        refresher.complete();
      }, 2000);
    }

  }

  datePick(){
    this.datePicker.show({
      date: new Date(),
      mode: 'datetime',
      allowOldDates: false,
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => this.dateExp = date,
      err => console.log('Error occurred while getting date: ', err)
    );
    this.doRefresh(null);
  }

  datePickYellow(){
    this.datePicker.show({
      date: new Date(),
      mode: 'datetime',
      allowOldDates: false,
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => this.dateYellow = date,
      err => console.log('Error occurred while getting date: ', err)
    );
    this.doRefresh(null);
  }

  addForm(){
    let loader = this.loadingCtrl.create({
      content: "Adding..."
    });
    loader.present();
    this.http.post(this.url+'/refrigerator/addItem', {id:this.rid,name:this.itemForm["name"],datetime:this.dateExp,datetimeYellow:this.dateYellow,private_key:this.itemForm["pvkey"]}, {})
      .then(data => {
        if (this.oldPhoto != this.myPhoto)
          this.uploadImage(this.itemForm["pvkey"],loader);
        else
          loader.dismiss();
        this.noti(this.dateExp);
        this.dismiss();
        this.doRefresh(null);
        console.log(data);
      })
      .catch(error => {

        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

      });
  }

  uploadImage(pv_key:any,loader:any){
    //create file transfer object
    const fileTransfer: FileTransferObject = this.transfer.create();


    //option transfer
    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: pv_key+"_" + Date.now() + ".jpg",
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: "image/jpeg",
      headers: {}
    }

    //file transfer action
    fileTransfer.upload(this.myPhoto, this.url+'/add/image/'+pv_key, options)
      .then((data) => {
        alert("Success");
        loader.dismiss();
      }, (err) => {
        console.log(err);
        alert("Error");
        loader.dismiss();
      });
  }

  noti(dateTime:string){
    //method add
    if (this.method == 1) {
      this.storage.get('id_noti')
        .then((id_noti)=>{
          if (id_noti < 0){
            id_noti = 0;
            this.storage.set('id_noti',0);
            this.storage.set(this.itemForm["pvkey"]+'_red',id_noti+1);
            this.storage.set(this.itemForm["pvkey"]+'_yellow',id_noti+2);
            this.localNotifications.schedule({
              id: id_noti+1,
              title:'Exprefrig : แจ้งเตือนสถานะ',
              text: this.itemForm["name"]+' หมดอายุ!!!',
              trigger:{at: new Date(dateTime)},
            });

            this.localNotifications.schedule({
              id: id_noti+2,
              title:'Exprefrig : แจ้งเตือนสถานะ',
              text: this.itemForm["name"]+' ใกล้หมดอายุ!!!',
              trigger:{at: new Date(this.dateYellow)},
            });
            this.storage.set('id_noti',id_noti+2);
          }
          else{
            this.localNotifications.schedule({
              id: id_noti+1,
              title:'Exprefrig : แจ้งเตือนสถานะ',
              text: this.itemForm["name"]+' หมดอายุ!!!',
              trigger:{at: new Date(dateTime)},
            });

            this.localNotifications.schedule({
              id: id_noti+2,
              title:'Exprefrig : แจ้งเตือนสถานะ',
              text: this.itemForm["name"]+' ใกล้หมดอายุ!!!',
              trigger:{at: new Date(this.dateYellow)},
            });
            this.storage.set('id_noti',id_noti+2);
          }
        });
    }else{ //method Edit
      this.storage.get(this.itemForm["pvkey"]+'_red').then((id_noti_red) => {
        this.id_noti_red = id_noti_red;
        this.storage.get(this.itemForm["pvkey"]+'_yellow').then((id_noti_yellow) => {
          if (id_noti_red > 0 && id_noti_yellow > 0){
            // Schedule a single notification
            this.localNotifications.cancel(id_noti_red);
            this.localNotifications.cancel(id_noti_yellow);
            this.localNotifications.schedule({
              id: id_noti_red,
              title:'Exprefrig : แจ้งเตือนสถานะ',
              text: this.itemForm["name"]+' หมดอายุ!!!',
              trigger:{at: new Date(dateTime)},
            });

            this.localNotifications.schedule({
              id: id_noti_yellow,
              title:'Exprefrig : แจ้งเตือนสถานะ',
              text: this.itemForm["name"]+' ใกล้หมดอายุ!!!',
              trigger:{at: new Date(this.dateYellow)},
            });
          }
          else {
            this.storage.get('id_noti')
              .then((id_noti)=>{
                if (id_noti < 0){
                  this.storage.set('id_noti',0);
                  this.storage.set(this.itemForm["pvkey"]+'_red',id_noti+1);
                  this.storage.set(this.itemForm["pvkey"]+'_yellow',id_noti+2);
                  this.localNotifications.schedule({
                    id: id_noti+1,
                    title:'Exprefrig : แจ้งเตือนสถานะ',
                    text: this.itemForm["name"]+' หมดอายุ!!!',
                    trigger:{at: new Date(dateTime)},
                  });

                  this.localNotifications.schedule({
                    id: id_noti+2,
                    title:'Exprefrig : แจ้งเตือนสถานะ',
                    text: this.itemForm["name"]+' ใกล้หมดอายุ!!!',
                    trigger:{at: new Date(this.dateYellow)},
                  });
                  this.storage.set('id_noti',id_noti+2);
                }
                else{
                  this.localNotifications.schedule({
                    id: id_noti+1,
                    title:'Exprefrig : แจ้งเตือนสถานะ',
                    text: this.itemForm["name"]+' หมดอายุ!!!',
                    trigger:{at: new Date(dateTime)},
                  });

                  this.localNotifications.schedule({
                    id: id_noti+2,
                    title:'Exprefrig : แจ้งเตือนสถานะ',
                    text: this.itemForm["name"]+' ใกล้หมดอายุ!!!',
                    trigger:{at: new Date(this.dateYellow)},
                  });
                  this.storage.set('id_noti',id_noti+2);
                }
              });
          }
        });
      });
    }
  }
}
