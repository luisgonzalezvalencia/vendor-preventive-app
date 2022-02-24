import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PedidosService } from 'src/app/services/config.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {

  private id: string;
  public nuevo: boolean = false;
  constructor(public navCtrl: NavController, public route: ActivatedRoute, public _ps: PedidosService) {

  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== "") {
      this._ps.obtener_pedido(this.id);
    } else {
      this.nuevo = true;
    }
  }

  volver() {
    this._ps.pedido = null;
    this.navCtrl.pop();
  }

}
