import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'edit-meal/:code/:key',
    loadComponent: () => import('./pages/edit-meal/edit-meal.page').then( m => m.EditMealPage)
  },
];