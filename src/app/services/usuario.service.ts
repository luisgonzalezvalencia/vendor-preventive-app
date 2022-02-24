import { Injectable } from '@angular/core';
import { URL_SERVICES } from "../../config/url.services";
import { HttpClient } from '@angular/common/http';
import { AlertController, Platform } from '@ionic/angular';

//plugin storage
import { Storage } from "@ionic/storage";
import { NetworkService, ConnectionStatus } from './network.service';
import { ComunService } from './comun.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  key_token: string;
  id_usuario: string;
  grupos: Array<object>;

  constructor(private http: HttpClient,
    private alertCtrl: AlertController,
    private platform: Platform,
    private storage: Storage,
    private networkService: NetworkService,
    private _cs: ComunService,
  ) {
    //this.cargar_storage();
  }

  activo(): boolean {
    if (this.key_token && this.key_token !== "" && this.key_token !== null) {
      // console.log(this.key_token);
      return true;
    } else {
      // console.log("usuario inactivo");
      return false;
    }
  }

  ingresar(usuario: string, password: string) {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      this._cs.presentAlert("No hay conexión",
        "Verifique la conexión",
        "Actualmente no se puede sincronizar los datos. Verifique su conexión e intente nuevamente.");
    } else {
      this._cs.present("Ingresando, aguarde un momento por favor...");
      var _this = this;
      let url = URL_SERVICES + "Auth/Login?usuario=" + usuario + "&password=" + password;
      return this.http.get(url)
        .subscribe(async data => {
          let response = data;
          let data_resp = response;
          console.log(data_resp);
          if (!data_resp["status"]) {

            (await this.alertCtrl.create({
              header: "Error Login",
              message: data_resp["message"],
              buttons: ["OK"]
            })).present();
          } else {
            this.key_token = data_resp["key"];
            this.id_usuario = data_resp["usuarioid"];
            this.grupos = data_resp["grupos"];

            //guardar storage
            this.guardar_storage();

          }
          this._cs.dismiss();

        },
          async error => {
            this._cs.dismiss();
            (await this.alertCtrl.create({
              header: "Error Login",
              message: "Error al intentar hacer la petición. Intente nuevamente o comuníquese con soporte.",
              buttons: ["OK"]
            })).present();
          });
    }
  }

  cerrar_sesion() {
    this.key_token = "";
    this.id_usuario = "";
    this.grupos = [];

    //guardar storage
    this.guardar_storage()
  }


  private guardar_storage() {
    if (this.platform.is("cordova")) {
      //dispositivo
      this.storage.set('key_token', this.key_token);
      this.storage.set('id_usuario', this.id_usuario);
      this.storage.set('grupos', this.grupos);
    } else {
      //computadora
      if (this.key_token && this.key_token != null) {
        localStorage.setItem("key_token", this.key_token);
        localStorage.setItem("id_usuario", this.id_usuario);
        localStorage.setItem("grupos", JSON.stringify(this.grupos));
      } else {
        localStorage.removeItem("key_token");
        localStorage.removeItem("id_usuario");
        localStorage.removeItem("grupos");
      }

    }
  }

  cargar_storage() {
    let promesa = new Promise((resolve, reject) => {
      if (this.platform.is("cordova")) {
        this.storage.ready()
          .then(() => {
            this.storage.get("key_token")
              .then(token => {
                if (token) {
                  this.key_token = token;
                }
              })

            this.storage.get("id_usuario")
              .then(id_usuario => {
                if (id_usuario) {
                  this.id_usuario = id_usuario;
                }
              })

            this.storage.get("grupos")
              .then(grupos => {
                if (grupos) {
                  this.grupos = grupos;
                }
                resolve();
              })
          })

      } else {
        if (localStorage.getItem("key_token")) {
          this.key_token = localStorage.getItem("key_token");
        }

        if (localStorage.getItem("id_usuario")) {
          this.id_usuario = localStorage.getItem("id_usuario");
        }

        if (localStorage.getItem("grupos")) {
          this.grupos = JSON.parse(localStorage.getItem("grupos"));
        }

        resolve();

      }

      return promesa;

    })

  }
}
