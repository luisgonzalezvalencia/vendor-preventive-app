import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';
import { ToastController, Platform } from '@ionic/angular';

export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  public status: ConnectionStatus;

  constructor(private toastController: ToastController, public plt: Platform, public network: Network) {
    this.plt.ready().then(() => {
      this.initializeNetworkEvents();
      this.status = this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
    });
  }

  public initializeNetworkEvents() {
    console.log('initialize network events');

    this.network.onDisconnect().subscribe(() => {
      this.updateNetworkStatus(ConnectionStatus.Offline);
    });

    this.network.onConnect().subscribe(() => {
      this.updateNetworkStatus(ConnectionStatus.Online);
    });

  }

  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status = status;
    let connection = status == ConnectionStatus.Offline ? 'sin conexión' : 'en línea';
    let toast = this.toastController.create({
      message: `Ahora estás ${connection}`,
      duration: 3000,
      position: 'middle'
    });
    toast.then(toast => toast.present());
  }

  // public onNetworkChange(): Observable<ConnectionStatus> {
  //   return this.status.asObservable();
  // }

  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status;
  }

}
