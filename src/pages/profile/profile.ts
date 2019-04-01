import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {HTTP} from "@ionic-native/http";
import {Events} from "ionic-angular";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  email: string;
  name: string;
  password: string;
  url: string;
  uid: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public http: HTTP,
              public events: Events) {
    this.storage.get("email")
      .then(val => {
        this.email = val;
        this.storage.get("name")
          .then(name => {
            this.name = name;
          });
        this.storage.get("urlApi")
          .then(api => {
            this.url = api;
          });
        this.storage.get("uid")
          .then(uid => {
            this.uid = uid;
          });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  submit() {
    if (this.password) {
      this.http.put(this.url + "/update/" + this.uid, {
        auth: "0fa2e78f70d377d5da274ebd4e8b5e1c",
        name: this.name,
        password: this.password
      }, {})
        .then(data => {
            alert("success");
            this.storage.set("name", this.name);
            this.events.publish('user:login');
          }
        )
    }
    else {
      this.http.put(this.url + "/update/" + this.uid, {auth: "0fa2e78f70d377d5da274ebd4e8b5e1c", name: this.name}, {})
        .then(data => {
            alert("success");
            this.storage.set("name", this.name);
            this.events.publish('user:login');
          }
        )
    }
  }

}
