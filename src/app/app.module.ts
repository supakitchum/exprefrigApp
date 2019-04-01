import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot';

import { AboutPage } from '../pages/about/about';
import { IndexPage } from '../pages/index/index';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ItemPage } from '../pages/item/item';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { WifiscannerPage } from '../pages/wifiscanner/wifiscanner';
import { AddRefrigeratorPage } from '../pages/add-refrigerator/add-refrigerator';
import { AddItemPage } from '../pages/add-item/add-item';

import { HTTP } from '@ionic-native/http';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DatePicker } from '@ionic-native/date-picker';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { ProfilePage } from "../pages/profile/profile";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    IndexPage,
    HomePage,
    TabsPage,
    ItemPage,
    ItemDetailPage,
    WifiscannerPage,
    AddRefrigeratorPage,
    AddItemPage,
    ProfilePage

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    IndexPage,
    HomePage,
    TabsPage,
    ItemPage,
    ItemDetailPage,
    WifiscannerPage,
    AddRefrigeratorPage,
    AddItemPage,
    ProfilePage
  ],
  providers: [
    HTTP,
    StatusBar,
    SplashScreen,
    Hotspot,
    LocalNotifications,
    InAppBrowser,
    DatePicker,
    Camera,
    File,FileTransfer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
