import { Component, OnInit } from '@angular/core';
import { PedidosService, UsuarioService, ComunService, PedidonuevoService } from '../../services/config.service';
import { NavController } from '@ionic/angular';
import { URL_WEB } from 'src/config/url.services';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {


  pedidosNoSincronizados: Array<string> = [];
  url_web: string = URL_WEB;
  constructor(public _ps: PedidosService, public _us: UsuarioService,
    public navCtrl: NavController, public _pns: PedidonuevoService, public _cs: ComunService) {
    this._pns.cargar_storage();

  }

  ngOnInit() {
    var activo = this._us.activo();
    if (activo) {
      var pedidos = this._ps.pedidos;
      if (pedidos.length === 0) {
        //cargo todos sin realizar la peticion
        this._ps.cargar_todos(false);
      }
    }
  }

  recargar_pedidos(event) {
    console.log('recargando pedidos...');
    this._ps.cargar_todos(true);
    event.target.complete();
  }

  VerPedido(pedido) {
    this.navCtrl.navigateForward("pedido/" + pedido.id);
  }

  VerPedidoPendiente(pedido) {
    this._pns.detalles = pedido.detalles;
    this._pns.clienteid = pedido.clienteid;
    this.navCtrl.navigateForward("pedidonuevo/" + pedido.id);
  }

  enviarPedidoPendiente(pedido) {
    this._pns.guardarPedido(pedido.detalles, pedido.fecha, pedido.clienteid, pedido.cliente, pedido.id).add(() => {
      if (this._pns.pedidoguardado) {
        this._pns.detalles = [];
        this._pns.clienteid = "";
        this._ps.cargar_todos(true);
      }
    });
  }

  eliminarPedidoPendiente(pedido) {
    this._pns.eliminarPedido(pedido);
  }

  FechaUltimosDias(fecha) {
    let fechaDate = new Date(fecha);
    let todayDate = new Date(Date.parse(Date()));
    let dateCompare = new Date();
    dateCompare.setDate(todayDate.getDate() - 10);
    if (dateCompare <= fechaDate) {
      return true;
    } else {
      return false;
    }
  }

  filtrar() {
    var search = "pedro";
    if (search && search != "") {
      this._ps.pedidos = this._ps.pedidos.filter(p => p.cliente.includes(search));
    }
    this._cs.dismissPopover();
  }

}
