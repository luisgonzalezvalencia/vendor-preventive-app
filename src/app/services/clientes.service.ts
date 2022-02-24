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
export class ClientesService {


  pagina: number = 0;
  clientes: any[] = [];
  hora_sincronizacion_clientes: string;

  cliente: any = null;

  constructor(private http: HttpClient, private _us: UsuarioService,
    private storage: Storage,
    private network: Network,
    private _cs: ComunService,
    private platform: Platform,
    private networkService: NetworkService) {
    this.cargar_storage();
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

        let url = URL_SERVICES + "ClientesUsuarios/GET?idusuario=" + this._us.id_usuario;
        this._cs.present("Actualizando lista de Clientes. Aguarde por favor...");
        this.http.get(url, requestOptions)
          .subscribe(async data => {
            let response = data;
            this.clientes = response["data"];
            this.hora_sincronizacion_clientes = new Date().toLocaleString();
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

  async obtener_cliente(id) {
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

      let url = URL_SERVICES + "Clientes/get?id=" + id;
      this._cs.present("Cargando los datos del cliente. Aguarde por favor...");
      await this.http.get(url, requestOptions)
        .subscribe(async data => {
          let response = data;
          this._cs.dismiss();
          this.cliente = response["data"];
          // this.hora_sincronizacion_clientes = new Date().toLocaleString();
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
      this.storage.set('clientes', this.clientes);
      this.storage.set('hora_sincronizacion_clientes', this.hora_sincronizacion_clientes);
    } else {
      //computadora
      if (this.clientes) {
        localStorage.setItem("clientes", JSON.stringify(this.clientes));
        localStorage.setItem("hora_sincronizacion_clientes", this.hora_sincronizacion_clientes);
      } else {
        localStorage.removeItem("clientes");
        localStorage.removeItem("hora_sincronizacion_clientes");
      }

    }
  }

  cargar_storage() {
    let promesa = new Promise((resolve, reject) => {
      if (this.platform.is("cordova")) {
        this.storage.ready()
          .then(() => {
            this.storage.get("clientes")
              .then(clientes => {
                if (clientes) {
                  this.clientes = clientes;
                }
              })

            this.storage.get("hora_sincronizacion_clientes")
              .then(hora_sincronizacion_clientes => {
                if (hora_sincronizacion_clientes) {
                  this.hora_sincronizacion_clientes = hora_sincronizacion_clientes;
                }
                resolve();
              })
          })

      } else {
        if (localStorage.getItem("clientes")) {
          this.clientes = JSON.parse(localStorage.getItem("clientes"));
        }



        if (localStorage.getItem("hora_sincronizacion_clientes")) {
          this.hora_sincronizacion_clientes = localStorage.getItem("hora_sincronizacion_clientes");
        }

        resolve();

      }

      return promesa;

    })

  }

}
