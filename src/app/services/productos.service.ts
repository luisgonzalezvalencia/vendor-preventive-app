import { Injectable } from '@angular/core';
import { URL_SERVICES } from "../../config/url.services";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from "./usuario.service";
import { ComunService } from "./comun.service";
import { Platform, AlertController } from '@ionic/angular';

//network plugin
import { Network } from '@ionic-native/network/ngx';

//plugin storage
import { Storage } from "@ionic/storage";
import { NetworkService, ConnectionStatus } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  pagina: number = 0;
  productos: any[] = [];
  producto: any = null;
  hora_sincronizacion_productos: string;

  constructor(private http: HttpClient, private _us: UsuarioService,
    private storage: Storage,
    private network: Network,
    private _cs: ComunService,
    private platform: Platform,
    private networkService: NetworkService,
    private alertCtrl: AlertController) {
    this.cargar_storage();
  }

  verificar_conexion() {
    // watch network for a disconnection
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
    });

    // stop disconnect watch
    // disconnectSubscription.unsubscribe();


    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });

    // stop connect watch
    // connectSubscription.unsubscribe();
  }

  cargar_todos(recargar = false) {
    if (recargar) {
      if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
        this._cs.presentAlert("No hay conexión",
          "Verifique la conexión",
          "Actualmente no se puede sincronizar los datos. Verifique su conexión e intente nuevamente.");
      } else {
        const headerDict = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
          'X-API-KEY': this._us.key_token
        }

        const requestOptions = {
          headers: new HttpHeaders(headerDict),
        };

        let url = URL_SERVICES + "Productos/GET";
        this._cs.present("Actualizando lista de productos. Aguarde por favor...");
        this.http.get(url, requestOptions)
          .subscribe(async data => {
            let response = data;
            this.productos = response["data"];
            this.hora_sincronizacion_productos = new Date().toLocaleString();
            this.guardar_storage();
            this._cs.dismiss();
          },
            async error => {
              this._cs.dismiss();
              this._cs.presentAlert("Petición errónea", "Error de comunicación con el servidor", "Se produjo un error intentando sincronizar los datos. Comuníquelo al administrador.");
            });
      }
    } else {
      this.cargar_storage();
    }
  }

  async obtener_producto(id) {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      this._cs.presentAlert("No hay conexión",
        "Verifique la conexión",
        "Actualmente no se puede sincronizar los datos. Verifique su conexión e intente nuevamente.");
    } else {
      const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-API-KEY': this._us.key_token
      }

      const requestOptions = {
        headers: new HttpHeaders(headerDict),
      };

      let url = URL_SERVICES + "Productos/GET?id=" + id;
      this._cs.present("Cargando los datos del producto. Aguarde por favor...");
      await this.http.get(url, requestOptions)
        .subscribe(async data => {
          let response = data;
          this._cs.dismiss();
          this.producto = response["data"];
          // this.hora_sincronizacion_productos = new Date().toLocaleString();
          // this.guardar_storage();

        },
          async error => {
            this._cs.dismiss();
            this._cs.presentAlert("Petición errónea", "Error de comunicación con el servidor", "Se produjo un error intentando sincronizar los datos. Comuníquelo al administrador.");
          }
        );
    }
  }


  private guardar_storage() {
    if (this.platform.is("cordova")) {
      //dispositivo
      this.storage.set('productos', this.productos);
      this.storage.set('hora_sincronizacion_productos', this.hora_sincronizacion_productos);
    } else {
      //computadora
      if (this.productos) {
        localStorage.setItem("productos", JSON.stringify(this.productos));
        localStorage.setItem("hora_sincronizacion_productos", this.hora_sincronizacion_productos);
      } else {
        localStorage.removeItem("productos");
        localStorage.removeItem("hora_sincronizacion_productos");
      }

    }
  }

  cargar_storage() {
    let promesa = new Promise((resolve, reject) => {
      if (this.platform.is("cordova")) {
        this.storage.ready()
          .then(() => {
            this.storage.get("productos")
              .then(productos => {
                if (productos) {
                  this.productos = productos;
                }
              })

            this.storage.get("hora_sincronizacion_productos")
              .then(hora_sincronizacion_productos => {
                if (hora_sincronizacion_productos) {
                  this.hora_sincronizacion_productos = hora_sincronizacion_productos;
                }
                resolve();
              })
          })

      } else {
        if (localStorage.getItem("productos")) {
          this.productos = JSON.parse(localStorage.getItem("productos"));
        }



        if (localStorage.getItem("hora_sincronizacion_productos")) {
          this.hora_sincronizacion_productos = localStorage.getItem("hora_sincronizacion_productos");
        }

        resolve();

      }

      return promesa;

    })

  }
}
