import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the WifiscannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-wifiscanner',
  templateUrl: 'wifiscanner.html',
})
export class WifiscannerPage {
  data: any;
  constructor(
    private iab: InAppBrowser,
    private hotspot: Hotspot,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad(){
    this.hotspot.scanWifi().then((networks: Array<HotspotNetwork>) => {
      this.data=networks;
    });

  }

  checkSSID(ssid:string){
    if (ssid.indexOf("Exprefrig") > -1){
      return true;
    }
    return false;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  connectWifi(ssid:string){
    this.hotspot.connectToWifi(ssid,"").then((status) =>{
      if (status){
        const browser = this.iab.create('http://192.168.4.1');
        browser.show();
      }
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.ionViewDidLoad();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}
