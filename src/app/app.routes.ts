import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'modal-tutorial',
    loadComponent: () =>
      import('./home/Components/modal-tutorial/modal-tutorial.component').then(
        (m) => m.ModalTutorialComponent
      ),
  },
  {
    path: '',
    redirectTo: 'modal-tutorial',
    pathMatch: 'full',
  },
];
