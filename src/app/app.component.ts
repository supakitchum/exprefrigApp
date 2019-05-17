import { Component ,ViewChild} from '@angular/core';
import {App, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { MenuController } from 'ionic-angular';
import { Events,Nav } from 'ionic-angular';

import { IndexPage } from '../pages/index/index'
import { AboutPage } from '../pages/about/about'
import { HomePage } from "../pages/home/home";
import { HTTP } from '@ionic-native/http';
import {ProfilePage} from "../pages/profile/profile";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  uid:any;
  email:string;
  name:string;
  loggedIn = false;
  @ViewChild(Nav) nav: Nav;
  constructor(http: HTTP,
              platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public storage: Storage,
              public menuCtrl: MenuController,
              public app: App,
              public events: Events) {
    this.storage.set('urlApi', 'http://192.168.137.1');
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.hide();
    });
    this.getUser();
    this.listenToLoginEvents();
  }

  getUser(){
    this.storage.get('uid').then((val) => {
      this.storage.get('email').then((email) => {
        this.email = email;
      });
      this.storage.get('name').then((name) => {
        this.name = name;
      });
      this.uid = val;
      if (this.uid){
        this.rootPage = AboutPage;
      }
      else{
        this.rootPage = IndexPage;
      }
    });
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.loggedIn = true;
      this.getUser();
    });

    this.events.subscribe('user:logout', () => {
      this.loggedIn = false;
    });
  }

  openDevicePage(){
    this.menuCtrl.close();
    this.app.getRootNav().setRoot(HomePage);
  }

  openAboutPage(){
    this.menuCtrl.close();
    this.app.getRootNav().setRoot(AboutPage);
  }

  openProfilePage(){
    this.menuCtrl.close();
    this.app.getRootNav().setRoot(ProfilePage);
  }

  logout(){
    this.storage.clear();
    this.storage.set('urlApi','http://192.168.137.1');
    this.menuCtrl.close();
    this.app.getRootNav().setRoot(IndexPage);
  }

  changeAPI(url:string){
    this.storage.clear();
    this.storage.set('urlApi',url);
    this.menuCtrl.close();
    this.app.getRootNav().setRoot(IndexPage);

  }

}
