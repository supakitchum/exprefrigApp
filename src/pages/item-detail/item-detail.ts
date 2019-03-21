import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ItemDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html',
})
export class ItemDetailPage {
  id = '';
  name = '';
  url:any;
  data:any;
  exp:any;
  hour = 0;
  min = 0;
  sec = 0;
  constructor(public storage: Storage,public navCtrl: NavController, public navParams: NavParams,public http: HTTP) {
    this.id = navParams.get('pv_key');
    this.name = navParams.get('name');
    storage.get('urlApi').then((val) => {
      this.url = val;
      this.http.get(val + "/get/device/"+ navParams.get('pv_key'), {}, {})
        .then(data => {
          this.data = JSON.parse(data.data);
          this.exp = JSON.parse(data.data);
          this.hour = this.exp.hour;
          this.min = this.exp.min;
          this.sec = this.exp.sec;
          this.StartTimer();

        })
        .catch(error => {

          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);

        });
    });
    // this.pushPage = LoginPage;
    // this.params = { id: 42 };
  }

  StartTimer(){
    setTimeout(() => {
      document.getElementById('time').innerText = "";
      if (this.hour < 0){
        this.hour = 0;
        this.min = 0;
        this.sec = 0;
        document.getElementById('time').innerText += " หมดอายุแล้ว";
        return;
      }
      if (this.hour < 10)
        document.getElementById('time').innerText += "0"+this.hour.toString()+" ชั่วโมง ";
      else
        document.getElementById('time').innerText += this.hour.toString()+" ชั่วโมง ";
      if (this.min < 10)
        document.getElementById('time').innerText += " "+"0"+this.min.toString()+" นาที ";
      else
        document.getElementById('time').innerText += " "+this.min.toString()+" นาที";
      if (this.sec < 10)
        document.getElementById('time').innerText += " "+"0"+this.sec.toString() + " วินาที";
      else
        document.getElementById('time').innerText += " "+this.sec.toString() + " วินาที";

      if(this.sec <= 0) {
        this.sec = 59;
        if (this.min <= 0){
          this.min = 59;
          this.hour -= 1;
        }
        else{
          this.min -= 1;
        }
      }
      else {
        this.sec -= 1;
      }
      this.StartTimer();
    }, 1000);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetailPage');
  }

}
