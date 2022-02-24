import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ComunService } from 'src/app/services/comun.service';
import { PedidosService, ProductosService, ClientesService, PedidonuevoService } from 'src/app/services/config.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-searchpopover',
  templateUrl: './searchpopover.page.html',
  styleUrls: ['./searchpopover.page.scss'],
})
export class SearchpopoverPage implements OnInit {
  public search: string = "";
  @Input() parametrofiltrar: string;
  @ViewChild('input', { static: false }) inputElement: IonInput;

  constructor(public _cs: ComunService, public pedidoService: PedidosService,
    public productoService: ProductosService, public clienteService: ClientesService,
    public pedidonuevoService: PedidonuevoService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.parametrofiltrar == "pedidos") {
      this.pedidoService.cargar_todos();
      this.pedidonuevoService.cargar_storage();
    }
    if (this.parametrofiltrar == "productos") {
      this.productoService.cargar_todos();
    }
    if (this.parametrofiltrar == "clientes") {
      this.clienteService.cargar_todos();
    }

    setTimeout(() => {
      this.inputElement.setFocus();
    }, 400);
  }

  filtrar() {
    console.log(this.parametrofiltrar);
    if (this.search !== "") {
      if (this.parametrofiltrar == "pedidos") {
        this.pedidoService.pedidos = this.pedidoService.pedidos.filter(p => p.cliente.toUpperCase().includes(this.search.toUpperCase()));
        this.pedidonuevoService.pedidos_pendientes = this.pedidonuevoService.pedidos_pendientes.filter(p => p.cliente.toUpperCase().includes(this.search.toUpperCase()));
      } else if (this.parametrofiltrar == "productos") {
        this.productoService.productos = this.productoService.productos.filter(p => p.nombre.toUpperCase().includes(this.search.toUpperCase()));
      } else if (this.parametrofiltrar == "clientes") {
        this.clienteService.clientes = this.clienteService.clientes.filter(p => p.nombre.toUpperCase().includes(this.search.toUpperCase())
          || p.apellido.toUpperCase().includes(this.search.toUpperCase())
          || p.direccion.toUpperCase().includes(this.search.toUpperCase()));
      }

    }



    this._cs.dismissPopover();
    // console.log('filtrando mi gente');
  }

}
