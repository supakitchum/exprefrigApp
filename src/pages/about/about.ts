import { Component } from '@angular/core';
import {NavController, AlertController, Platform, ModalController} from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ItemPage } from '../item/item';
import { AddRefrigeratorPage } from "../add-refrigerator/add-refrigerator";


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  url:any;
  data_refrig = '';
  params: Object;
  uid: any;
  pushPage: any;
  constructor(
    private localNotifications: LocalNotifications,
    public storage: Storage,
    public http: HTTP,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController
  )
  {
    storage.get('urlApi').then((val) => {
      this.url = val;
    });
    this.getData();
  }

  getData(){
    this.storage.get('uid').then((val) => {
      this.uid = val;
      let urlApi = this.url+"/get/app/"+val;
      this.http.get(urlApi, {}, {})
        .then(data => {
          this.data_refrig = JSON.parse(data.data);
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
    this.getData();
    if(refresher !== null){
      setTimeout(() => {
        refresher.complete();
      }, 2000);
    }

  }

  noti(){
    console.log("noti");
    // Schedule a single notification
    this.localNotifications.schedule({
      title:'Exprefrig : แจ้งเตือนสถานะ',
      text: 'แกงเขียวหวาน ของคุณหมดอายุ!!!',
      trigger:{at: new Date(new Date().getTime() + 5 * 1000)},
    });
  }

  parentPage(id:string,name:string){
    this.navCtrl.push(ItemPage, {
      id: id,
      name: name
    });
  }

  editName(id:any){
    const prompt = this.alertCtrl.create({
      title: 'Edit Name',
      message: "Enter a new name.",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
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
          text: 'Add',
          handler: data => {
            this.http.put(this.url+'/update/refrigerators/'+id, {name_refrig:data.name}, {})
              .then(data => {
                console.log(data);
                this.doRefresh(null);
              })
              .catch(error => {

                console.log(error.status);
                console.log(error.error); // error message as string
                console.log(error.headers);

              });
          }
        }
      ]
    });
    prompt.present();
  }

  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'New Refrigerator',
      message: "Enter a name for new refrigerator.",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
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
          text: 'Add',
          handler: data => {
            this.http.post(this.url+'/refrigerator/add', {name:data.name,uid:this.uid}, {})
              .then(data => {
                console.log(data);
                this.doRefresh(null);
              })
              .catch(error => {

                console.log(error.status);
                console.log(error.error); // error message as string
                console.log(error.headers);

              });
          }
        }
      ]
    });
    prompt.present();
  }

  delete(id:string){
    this.http.delete(this.url+"/delete/"+id,{},{})
      .then(data => {
        console.log(data);
        this.doRefresh(null);
      })
      .catch(error => {

        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

      });
  }
}
