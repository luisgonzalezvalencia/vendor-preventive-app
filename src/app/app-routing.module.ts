import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadChildren: './views/login/login.module#LoginPageModule' },
  { path: '', loadChildren: () => import('./views/tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'producto/:id', loadChildren: './views/producto/producto.module#ProductoPageModule' },
  { path: 'cliente/:id', loadChildren: './views/cliente/cliente.module#ClientePageModule' },
  { path: 'pedido/:id', loadChildren: './views/pedido/pedido.module#PedidoPageModule' },
  { path: 'pedidonuevo/:idpendiente', loadChildren: './views/pedidonuevo/pedidonuevo.module#PedidonuevoPageModule' },
  { path: 'pedidonuevoproductos/:codigobusqueda', loadChildren: './views/pedidonuevoproductos/pedidonuevoproductos.module#PedidonuevoproductosPageModule' },  { path: 'searchpopover', loadChildren: './views/searchpopover/searchpopover.module#SearchpopoverPageModule' }








  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  // {
  //   path: 'login',
  //   loadChildren: './login/login.module#LoginPageModule'
  // }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
