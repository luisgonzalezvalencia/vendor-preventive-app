import { Component, OnInit } from '@angular/core';
import { ClientesService, UsuarioService, PedidonuevoService } from '../../services/config.service';
import { URL_WEB } from '../../../config/url.services';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  url_web: string = URL_WEB;
  constructor(public _cs: ClientesService, public _us: UsuarioService,
    public navCtrl: NavController, public _pns: PedidonuevoService) {

  }


  ngOnInit() {
    var activo = this._us.activo();
    if (activo) {
      var clientes = this._cs.clientes;
      if (clientes.length == 0) {
        //cargo todos sin realizar la peticion
        this._cs.cargar_todos(false);
      }
    }
  }

  recargar_clientes(event) {
    console.log('recargando clientes...');
    this._cs.cargar_todos(true);
    event.target.complete();
  }

  VerCliente(cliente) {
    this.navCtrl.navigateForward("cliente/" + cliente.id);
  }

  nuevoPedidoCliente(cliente) {
    this._pns.clienteid = cliente.id;
    this.navCtrl.navigateForward("pedidonuevo/");
  }

}
