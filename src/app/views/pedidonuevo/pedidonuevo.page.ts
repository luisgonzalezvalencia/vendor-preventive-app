import { Component, OnInit } from '@angular/core';
import { ClientesService, ProductosService, PedidonuevoService, ComunService, PedidosService } from 'src/app/services/config.service';
import { NavController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pedidonuevo',
  templateUrl: './pedidonuevo.page.html',
  styleUrls: ['./pedidonuevo.page.scss'],
})
export class PedidonuevoPage implements OnInit {
  cliente: string = "";
  total: number = 0.0;
  detalles: any[] = [];
  codigobusqueda: string = "";
  idpedidopendiente: string = "";

  constructor(public _cs: ClientesService, public navCtrl: NavController,
    public modalCtrl: ModalController, public _pns: PedidonuevoService, public _ps: PedidosService,
    public _comunService: ComunService, public route: ActivatedRoute) {

  }

  ngOnInit() {
    // this.idpedidopendiente = this.route.snapshot.paramMap.get('idpendiente');
  }

  ionViewWillEnter() {
    this.idpedidopendiente = this.route.snapshot.paramMap.get('idpendiente');
    var clientes = this._cs.clientes;
    if (clientes.length > 0) {
      //cargo todos sin realizar la peticion
      this._cs.cargar_todos(false);
    } else {
      //cargo todos realizando la peticion
      this._cs.cargar_todos(true);
    }
    this.detalles = this._pns.detalles;
    this.cliente = this._pns.clienteid;
    this.calcularTotal();

    console.log(this.cliente);
  }

  asignarCliente() {
    this._pns.clienteid = this.cliente;
  }

  calcularTotal() {
    this.total = 0.0;
    for (let detalle of this.detalles) {
      this.total = this.total + detalle.subtotal;
    }
  }

  BuscarProducto() {
    this.navCtrl.navigateForward("pedidonuevoproductos/" + this.codigobusqueda);
  }

  eliminarDetalle(detalle) {
    this._pns.eliminarDetalle(detalle);
    this.detalles = this._pns.detalles;
    this.calcularTotal();
  }


  guardarPedido() {
    if (this.cliente == "") {
      this._comunService.presentAlert("Alerta Pedido", "Datos Incompletos", "Debe seleccionar un cliente para guardar el pedido");
      return;
    }

    if (this.detalles.length == 0) {
      this._comunService.presentAlert("Alerta Pedido", "Datos Incompletos", "Debe agregar productos para realizar el pedido");
      return;
    }

    var clienteObject = this._cs.clientes.filter(c => c.id == this.cliente)[0];
    var nombrecliente = clienteObject.nombre + ' ' + clienteObject.apellido;
    var fecha = this._comunService.fechaActual();
    this._pns.guardarPedido(this.detalles, fecha, this.cliente, nombrecliente, this.idpedidopendiente).add(() => {
      var guardado = this._pns.pedidoguardado;
      if (guardado) {
        this._ps.cargar_todos(true);
      }
    })

    //ver si hay que limpiar
    this._pns.detalles = [];
    this.detalles = [];
    this.cliente = "";
    this._pns.clienteid = "";
    this.navCtrl.navigateBack("dashboard/tab1");

  }

  guardarTemporal() {
    if (this.cliente == "") {
      this._comunService.presentAlert("Alerta Pedido", "Datos Incompletos", "Debe seleccionar un cliente para guardar el pedido");
      return;
    }

    if (this.detalles.length == 0) {
      this._comunService.presentAlert("Alerta Pedido", "Datos Incompletos", "Debe agregar productos para realizar el pedido");
      return;
    }

    var clienteObject = this._cs.clientes.filter(c => c.id == this.cliente)[0];
    var nombrecliente = clienteObject.nombre + ' ' + clienteObject.apellido;
    var fecha = this._comunService.fechaActual();
    this._pns.guardarTemporal(this.detalles, fecha, this.cliente, nombrecliente, this.idpedidopendiente);
    this._ps.cargar_todos(false);

    this._pns.detalles = [];
    this.detalles = [];
    this.cliente = "";
    this._pns.clienteid = "";
    this.navCtrl.navigateBack("dashboard/tab1");

  }

  ionViewWillLeave() {
    console.log("saliendo del pedido, si no se guardo se borra");
  }

  volver() {
    this.navCtrl.pop();
  }

}
