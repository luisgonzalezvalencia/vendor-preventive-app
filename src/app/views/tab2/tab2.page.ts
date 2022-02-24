import { Component, OnInit } from '@angular/core';
import { ProductosService, UsuarioService } from '../../services/config.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {


  constructor(public _ps: ProductosService, public _us: UsuarioService,
    public navCtrl: NavController) {

  }

  ngOnInit() {
    var activo = this._us.activo();
    if (activo) {
      var productos = this._ps.productos;
      if (productos.length == 0) {
        //cargo todos sin realizar la peticion
        this._ps.cargar_todos(false);
      }
    }
  }

  recargar_productos(event) {
    console.log('recargando productos...');
    this._ps.cargar_todos(true);
    event.target.complete();
  }

  VerProducto(producto) {
    this.navCtrl.navigateForward("producto/" + producto.id);
  }

}
