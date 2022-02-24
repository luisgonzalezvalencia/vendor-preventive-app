import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../services/config.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {
  private id: string;
  public datos: object;
  constructor(public navCtrl: NavController, public route: ActivatedRoute, public _ps: ProductosService) {

  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== "") {
      this._ps.obtener_producto(this.id);
    }
  }

  volver() {
    this._ps.producto = null;
    this.navCtrl.pop();
  }

}
