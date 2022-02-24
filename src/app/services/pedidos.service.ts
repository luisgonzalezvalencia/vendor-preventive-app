import { Injectable } from '@angular/core';
import { URL_SERVICES } from "../../config/url.services";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from "./usuario.service";
import { ComunService } from "./comun.service";
import { Platform } from '@ionic/angular';

//network plugin
import { Network } from '@ionic-native/network/ngx';

//plugin storage
import { Storage } from "@ionic/storage";
import { NetworkService, ConnectionStatus } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  pagina: number = 0;
  pedidos: any[] = [];
  hora_sincronizacion_pedidos: string;

  pedido: any = null;

  constructor(private http: HttpClient, private _us: UsuarioService,
    private storage: Storage,
    private network: Network,
    private _cs: ComunService,
    private platform: Platform,
    private networkService: NetworkService) {
    // this.cargar_storage();
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

        let url = URL_SERVICES + "Pedidos/GET?usuarioid=" + this._us.id_usuario;
        this._cs.present("Actualizando lista de Pedidos. Aguarde por favor...");
        this.http.get(url, requestOptions)
          .subscribe(async data => {
            let response = data;
            this.pedidos = response["data"];
            this.hora_sincronizacion_pedidos = new Date().toLocaleString();
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

  async obtener_pedido(id) {
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

      let url = URL_SERVICES + "Pedidos/GET?id=" + id;
      this._cs.present("Cargando los datos del pedido. Aguarde por favor...");
      await this.http.get(url, requestOptions)
        .subscribe(async data => {
          let response = data;
          this._cs.dismiss();
          this.pedido = response["data"];
          // this.hora_sincronizacion_pedidos = new Date().toLocaleString();
          // this.guardar_storage();

        },
          async error => {
            this._cs.dismiss();
            this._cs.presentAlert("Petición errónea", "Error de comunicación con el servidor", "Se produjo un error intentando sincronizar los datos. Comuníquelo al administrador.");
          });
    }
  }


  private guardar_storage() {
    if (this.platform.is("cordova")) {
      //dispositivo
      this.storage.set('pedidos', this.pedidos);
      this.storage.set('hora_sincronizacion_pedidos', this.hora_sincronizacion_pedidos);
    } else {
      //computadora
      if (this.pedidos) {
        localStorage.setItem("pedidos", JSON.stringify(this.pedidos));
        localStorage.setItem("hora_sincronizacion_pedidos", this.hora_sincronizacion_pedidos);
      } else {
        localStorage.removeItem("pedidos");
        localStorage.removeItem("hora_sincronizacion_pedidos");
      }

    }
  }

  cargar_storage() {
    let promesa = new Promise((resolve, reject) => {
      if (this.platform.is("cordova")) {
        this.storage.ready()
          .then(() => {
            this.storage.get("pedidos")
              .then(pedidos => {
                if (pedidos) {
                  this.pedidos = pedidos;
                }
              })

            this.storage.get("hora_sincronizacion_pedidos")
              .then(hora_sincronizacion_pedidos => {
                if (hora_sincronizacion_pedidos) {
                  this.hora_sincronizacion_pedidos = hora_sincronizacion_pedidos;
                }
                resolve();
              })
          })

      } else {
        if (localStorage.getItem("pedidos")) {
          this.pedidos = JSON.parse(localStorage.getItem("pedidos"));
        }



        if (localStorage.getItem("hora_sincronizacion_pedidos")) {
          this.hora_sincronizacion_pedidos = localStorage.getItem("hora_sincronizacion_pedidos");
        }

        resolve();

      }

      return promesa;

    })

  }

}
