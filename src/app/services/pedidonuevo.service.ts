import { Injectable } from '@angular/core';
import { NetworkService, ConnectionStatus } from './network.service';
import { URL_SERVICES } from "../../config/url.services";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ComunService } from './comun.service';
import { Platform } from '@ionic/angular';
//network plugin
import { Network } from '@ionic-native/network/ngx';
//plugin storage
import { Storage } from "@ionic/storage";
import { UsuarioService } from './usuario.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidonuevoService {

  pedidos_pendientes: any[] = [];
  detalles: any[] = [];
  clienteid: string = "";
  pedidoid: "";
  fecha: string = "";
  pedidoguardado: boolean = false;

  constructor(public networkService: NetworkService, public _cs: ComunService, private network: Network,
    private http: HttpClient, private _us: UsuarioService,
    private platform: Platform, public storage: Storage) {
    //cargar storage

  }

  //todas las acciones del pedido nuevo
  agregarDetalle(detalle_nuevo: any) {
    for (let producto of this.detalles) {
      if (producto.codigo == detalle_nuevo.codigo) {
        var _this = this;
        //por ahora retorno pero deberia actualizar los datos
        this.detalles.filter(function (element, index) {
          if (element.codigo.toString().toUpperCase() == producto.codigo.toString().toUpperCase()) {
            _this.detalles[index].preciounitario = detalle_nuevo.preciounitario;
            _this.detalles[index].listaid = detalle_nuevo.listaid;
            _this.detalles[index].cantidad = detalle_nuevo.cantidad;
            _this.detalles[index].subtotal = detalle_nuevo.subtotal;
            return element;
          }
        });

        return;
      }
    }
    this.detalles.push(detalle_nuevo);

    console.log(this.detalles);
  }


  eliminarDetalle(detalle_eliminar: any) {
    var _this = this;
    //por ahora retorno pero deberia actualizar los datos
    this.detalles = this.detalles.filter(function (element, index) {
      if (element.codigo.toString().toUpperCase() != detalle_eliminar.codigo.toString().toUpperCase()) {
        return element;
      }
    });
    console.log(this.detalles);
  }

  eliminarPedido(pedido: any) {
    this.pedidos_pendientes = this.pedidos_pendientes.filter(function (element, index) {
      if (element.id.toString().toUpperCase() != pedido.id.toString().toUpperCase()) {
        return element;
      }
    });
    for (let index = 0; index < this.pedidos_pendientes.length; index++) {
      this.pedidos_pendientes[index].id = "pendiente_" + (index + 1);
    }
    this.guardar_storage();
  }

  guardarTemporal(detalles_pedido: any[], fecha: any, clienteid: any, nombrecliente: any, idpedidopendiente: any) {
    console.log(idpedidopendiente);
    this.pedidoguardado = false;
    this.detalles = detalles_pedido;
    this.clienteid = clienteid;
    this.fecha = fecha;
    this.pedidoid = "";

    var pedido = {
      id: "",
      fecha: this.fecha,
      clienteid: this.clienteid,
      detalles: this.detalles,
      usuarioid: this._us.id_usuario,
      entregado: "0",
      cancelado: "0",
      fechaEnvio: this._cs.fechaActual(),
      cliente: nombrecliente
    }

    if (idpedidopendiente != "" && idpedidopendiente != undefined) {
      pedido.id = idpedidopendiente;
      this.eliminarPedido(pedido);
      pedido.id = idpedidopendiente;
    } else {
      var cantidadpendiente = this.pedidos_pendientes.length;
      pedido.id = "pendiente_" + (cantidadpendiente + 1);
    }

    this.pedidos_pendientes.push(pedido);
    //guardar en storage
    this.guardar_storage();
  }

  guardarPedido(detalles_pedido: any[], fecha: any, clienteid: any, nombrecliente: any, idpedidopendiente: any) {
    this.pedidoguardado = false;
    this.detalles = detalles_pedido;
    this.clienteid = clienteid;
    this.fecha = fecha;
    this.pedidoid = "";

    var pedido = {
      id: "",
      fecha: this.fecha,
      clienteid: this.clienteid,
      detalles: this.detalles,
      usuarioid: this._us.id_usuario,
      entregado: "0",
      cancelado: "0",
      fechaEnvio: this._cs.fechaActual(),
      cliente: nombrecliente
    }

    let body = new HttpParams();
    body = body.set('id', pedido.id);
    body = body.set('fecha', pedido.fecha);
    body = body.set('clienteid', pedido.clienteid);
    body = body.set('detalles', JSON.stringify(pedido.detalles));
    body = body.set('usuarioid', pedido.usuarioid);
    body = body.set('entregado', pedido.entregado);
    body = body.set('cancelado', pedido.cancelado);
    body = body.set('fechaEnvio', pedido.fechaEnvio);

    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      if (idpedidopendiente == "" || idpedidopendiente == undefined) {
        var cantidadpendiente = this.pedidos_pendientes.length;
        pedido.id = "pendiente_" + (cantidadpendiente + 1);
        this.pedidos_pendientes.push(pedido);
      }
      //guardar en storage
      this.guardar_storage();

      this._cs.presentAlert("No hay conexión",
        "Verifique la conexión",
        "Actualmente no se puede enviar el pedido al servidor. Se guardará temporalmente en el dispositivo.");
      return Subscription.EMPTY;

    } else {
      const headerDict = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-API-KEY': this._us.key_token
      }

      const requestOptions = {
        headers: new HttpHeaders(headerDict),
      };

      let url = URL_SERVICES + "Pedidos/Post";
      this._cs.present("Guardando Pedido. Aguarde por favor...");
      return this.http.post(url, body, requestOptions)
        .subscribe(async data => {
          let response = data;
          this.pedidoguardado = true;

          if (idpedidopendiente != "" && idpedidopendiente != undefined) {
            pedido.id = idpedidopendiente;
            this.eliminarPedido(pedido);
          }

          this._cs.dismiss();

        },
          async error => {
            this._cs.dismiss();
            //guardar en storage
            this.pedidoguardado = false;
            if (idpedidopendiente == "" || idpedidopendiente == undefined) {
              var cantidadpendiente = this.pedidos_pendientes.length;
              pedido.id = "pendiente_" + (cantidadpendiente + 1);
              this.pedidos_pendientes.push(pedido);
            }
            this.guardar_storage();
            this._cs.presentAlert("Petición errónea", "Error de comunicación con el servidor", "Se produjo un error intentando guardar los datos. Comuníquelo al administrador.");
          });
    }

  }

  private guardar_storage() {
    if (this.platform.is("cordova")) {
      //dispositivo
      this.storage.set('pedidos_pendientes', this.pedidos_pendientes);
    } else {
      //computadora
      if (this.pedidos_pendientes) {
        localStorage.setItem("pedidos_pendientes", JSON.stringify(this.pedidos_pendientes));
      } else {
        localStorage.removeItem("pedidos_pendientes");
      }
    }
  }

  cargar_storage() {
    let promesa = new Promise((resolve, reject) => {
      if (this.platform.is("cordova")) {
        this.storage.ready()
          .then(() => {
            this.storage.get("pedidos_pendientes")
              .then(pedidos_pendientes => {
                if (pedidos_pendientes) {
                  this.pedidos_pendientes = pedidos_pendientes;
                }
                resolve();
              })
          })

      } else {
        if (localStorage.getItem("pedidos_pendientes")) {
          this.pedidos_pendientes = JSON.parse(localStorage.getItem("pedidos_pendientes"));
        }

        resolve();
      }

      return promesa;

    })

  }
}
