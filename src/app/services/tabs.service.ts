import { Injectable, Component } from '@angular/core';
import { Router, Route } from '@angular/router';

//usuario services
import { UsuarioService } from './usuario.service';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

//login modal
import { LoginPage } from "../views/login/login.page";
import { Tab1Page } from '../views/tab1/tab1.page';

@Injectable({
  providedIn: 'root'
})


export class TabsService {

  constructor(private storage: Storage,
    private _us: UsuarioService,
    private router: Router) {
    this.verificar_login();
  }

  async verificar_login() {
    // let modal: any;
    var usuarioactivo = this._us.activo();
    if (!usuarioactivo) {
      this.router.navigate(['login']);
    }

  }
}
