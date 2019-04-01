import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { AboutPage } from '../about/about';
import { IndexPage } from '../index/index';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = IndexPage;

  constructor() {

  }
}
