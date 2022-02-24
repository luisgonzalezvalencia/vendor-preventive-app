import { Component } from '@angular/core';
import { TabsService, UsuarioService, ComunService, PedidosService, ProductosService, ClientesService, PedidonuevoService } from '../../services/config.service';
import { URL_WEB } from "../../../config/url.services";
import { Platform, PopoverController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SearchpopoverPage } from '../searchpopover/searchpopover.page';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  logo: string = URL_WEB + "assets/img/custom/logo.jpeg";
  subscription: any;
  constructor(private _ts: TabsService,
    public _us: UsuarioService,
    private platform: Platform,
    public router: Router,
    public popoverController: PopoverController,
    public _cs: ComunService, public navCtrl: NavController,
    public pedidoService: PedidosService, public productoService: ProductosService,
    public clienteService: ClientesService, public pedidonuevoService: PedidonuevoService
  ) {

  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  NuevoPedido() {
    this.router.navigateByUrl('pedidonuevo/');
  }

  cerrar_sesion() {
    this._us.cerrar_sesion();
    this._ts.verificar_login();
  }

  public filtrar() {
    console.log("oa");
  }

  MostrarPopOverFiltro() {
    var ev: any;
    var componente = SearchpopoverPage;
    var parametro = "";
    var pageActual = this.router.url.split("/");
    switch (pageActual[2]) {
      case "tab1":
        parametro = "pedidos";
        break;
      case "tab2":
        parametro = "productos";
        break;
      case "tab3":
        parametro = "clientes";
        break;
      default:
        break;
    }
    this._cs.presentPopover(ev, componente, parametro);
  }

  LimpiarFiltros() {
    var parametro = "";
    var pageActual = this.router.url.split("/");
    switch (pageActual[2]) {
      case "tab1":
        parametro = "pedidos";
        break;
      case "tab2":
        parametro = "productos";
        break;
      case "tab3":
        parametro = "clientes";
        break;
      default:
        break;
    }

    if (parametro == "pedidos") {
      this.pedidoService.cargar_todos();
      this.pedidonuevoService.cargar_storage();
    }
    if (parametro == "productos") {
      this.productoService.cargar_todos();
    }
    if (parametro == "clientes") {
      this.clienteService.cargar_todos();
    }

  }

  RecargarTodos() {
    this.pedidoService.cargar_todos(true);
    var _this = this;
    setTimeout(function () {
      _this.productoService.cargar_todos(true);
    }, 1000);

    setTimeout(function () {
      _this.clienteService.cargar_todos(true);
    }, 2000);
  }



}
