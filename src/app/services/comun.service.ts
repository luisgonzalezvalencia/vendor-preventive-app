import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { LoadingController, AlertController, PopoverController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class ComunService {

  public isLoading = false;
  public currentPopover;

  constructor(public loadingController: LoadingController,
    private alertCtrl: AlertController,
    public popoverController: PopoverController) {

  }

  async present(message) {
    this.isLoading = true;
    return await this.loadingController.create({
      message: message
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }


  async presentAlert(header, subheader, message) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subheader,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }


  fechaActual(): string {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, "0") + '-' + today.getDate().toString().padStart(2, "0");
    var time = today.getHours().toString().padStart(2, "0") + ":" + today.getMinutes().toString().padStart(2, "0") + ":" + today.getSeconds().toString().padStart(2, "0");
    var dateTime = date + ' ' + time;
    return dateTime;
  }

  async presentPopover(ev: any, componente, parametro) {
    this.currentPopover = await this.popoverController.create({
      component: componente,
      componentProps: {
        "parametrofiltrar": parametro
      },
      event: ev,
      translucent: true
    });
    return await this.currentPopover.present();
  }

  dismissPopover() {
    if (this.currentPopover) {
      this.currentPopover.dismiss().then(() => { this.currentPopover = null; });
    }
  }

  // constructor(private loadingController: LoadingController) {
  //   this.loading = this.loadingController.create({
  //     message: ""
  //   });
  // }

  // public async presentLoader(message: string): Promise<void> {
  //   if (!this.isShowing) {
  //     this.isShowing = true;
  //     this.loading.message = message;
  //     return await this.loading.present();
  //   } else {
  //     // If loader is showing, only change text, won't create a new loader.
  //     this.isShowing = true;
  //     this.loading.message = message;
  //   }
  // }

  // public async dismissLoader(): Promise<void> {
  //   // if (this.loading && this.isShowing) {
  //   this.isShowing = false;
  //   await this.loading.dismiss();
  //   // }
  // }
}