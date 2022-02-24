import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ClientesService } from '../../services/config.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {
  private id: string;
  public datos: object;
  constructor(public navCtrl: NavController,
    public route: ActivatedRoute,
    public _cs: ClientesService) {

  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== "") {
      this._cs.obtener_cliente(this.id);
    }
  }

  volver() {
    this.navCtrl.pop();
  }

}
