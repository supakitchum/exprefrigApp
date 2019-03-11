import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import { HTTP } from '@ionic-native/http';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(http: HTTP,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public storage: Storage) {
    this.storage.set('urlApi', 'http://192.168.137.1');
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      statusBar.backgroundColorByHexString('#ffffff');
      statusBar.hide();
    });
  }
}
