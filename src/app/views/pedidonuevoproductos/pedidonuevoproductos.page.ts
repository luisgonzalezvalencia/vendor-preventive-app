import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductosService, UsuarioService, PedidonuevoService, ComunService } from 'src/app/services/config.service';
import { ModalController, NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pedidonuevoproductos',
  templateUrl: './pedidonuevoproductos.page.html',
  styleUrls: ['./pedidonuevoproductos.page.scss'],
})
export class PedidonuevoproductosPage implements OnInit {

  codigobusqueda: string = "";
  detalles: any[] = [];
  productos: any[] = [];
  cantidad = 1;
  preciolista: string = "";
  arrayCantidad: any[] = Array.from(Array(100).keys()).map(x => ++x);


  constructor(public route: ActivatedRoute, public _ps: ProductosService,
    public _us: UsuarioService, public navCtrl: NavController, public _pn: PedidonuevoService, public _cs: ComunService) { }

  ngOnInit(): void {
    this.codigobusqueda = this.route.snapshot.paramMap.get('codigobusqueda');
  }

  ionViewWillEnter() {
    this.codigobusqueda = this.route.snapshot.paramMap.get('codigobusqueda');
    var activo = this._us.activo();
    if (activo) {
      var productos = this._ps.productos;
      if (productos.length <= 0) {
        //cargo todos sin realizar la peticion
        this._ps.cargar_todos(false);
      }
      // else {
      //   //cargo todos realizando la peticion
      //   this._ps.cargar_todos(true);
      // }
    }

    this.filtrarProductosBusqueda();

  }

  filtrarProductosBusqueda() {
    console.log('filtrando productos');
    this.productos = this._ps.productos.filter(
      producto => producto.listas.length > 0
    );

    if (this.codigobusqueda && this.codigobusqueda !== "") {
      this.productos = this._ps.productos.filter(
        producto => producto.codigo.toUpperCase().includes(this.codigobusqueda.toUpperCase()) || producto.nombre.toUpperCase().includes(this.codigobusqueda.toUpperCase()));
    }

    this.productos = this.productos.slice(0, 20);
    // console.log(this.productos);


  }

  agregar(producto_nuevo: any) {
    var cantidad: number = parseInt((<HTMLInputElement>document.getElementById("cantidad-" + producto_nuevo.codigo)).value);
    var select = (<HTMLInputElement>document.getElementById("precioLista-" + producto_nuevo.codigo)).value;
    var selectData = select.split("-");
    var precio = parseFloat(selectData[1]);
    var listaid = selectData[0];

    if (isNaN(cantidad) || isNaN(precio)) {
      this._cs.presentAlert("Alerta", "Faltan datos", "Debe seleccionar la cantidad y el precio de lista para agregar el detalle");
      return;
    }

    var nuevoDetalles = {
      id: "",
      codigo: producto_nuevo.codigo,
      nombre: producto_nuevo.nombre,
      preciounitario: precio,
      listaid: listaid,
      cantidad: cantidad,
      subtotal: cantidad * precio
    };

    this._pn.agregarDetalle(nuevoDetalles);
    this.volver();
  }

  volver() {
    this.navCtrl.pop();
  }

}
