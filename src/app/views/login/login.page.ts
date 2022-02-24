import { Component, OnInit, ViewChild } from '@angular/core';
import { URL_WEB } from "../../../config/url.services";
import { NavController, NavParams, Platform, AlertController, IonInput } from '@ionic/angular';
import { Router, Route } from '@angular/router';
import { UsuarioService, ComunService } from "../../services/config.service";
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('passInput', { static: false }) passInput: IonInput;

  logo: string = "assets/images/favicon.png";
  usuario: string = "";
  contrasena: string = "";
  subscription: any;
  constructor(
    public navCtrl: NavController,
    private _us: UsuarioService,
    private router: Router,
    private _cs: ComunService,
    private platform: Platform,
    public alertController: AlertController) {
    // if (this._us.activo) {
    //   this.router.navigateByUrl('/tabs/tab1');
    // }
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    var usuarioactivo = this._us.activo();
    var cargar = this._us.cargar_storage();
    usuarioactivo = this._us.activo();
    if (usuarioactivo) {
      //console.log('usuario activo');
      this.router.navigate(['dashboard']);
    }
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  focusPass() {
    this.passInput.setFocus();
  }


  ingresar() {
    this._us.ingresar(this.usuario, this.contrasena)
      .add(() => {
        var activo = this._us.activo();
        if (activo) {
          var _this = this;
          // this._cs.dismiss().then(function () {
          _this.router.navigate(['dashboard']);
          // });
          // this.modalCtrl.dismiss(true);

        } else {
          var _this = this;
          // this._cs.dismiss().then(function () {
          // _this.alertErrorLogin();
          _this.router.navigate(['login']);
          // });

        }
      });
  }

  guardar_storage() {

  }

  cargar_storage() {

  }
}
