import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

// Redefine console.warn para suprimir avisos específicos do Ionicons
console.warn = ((warn) => {
  return (...args: any[]) => {
    const msg = args[0];
    if (typeof msg === 'string' && msg.includes('[Ionicons Warning]:')) {
      return; // Ignora avisos do Ionicons
    }
    warn.apply(console, args); // Chama o warn original com os argumentos corretos
  };
})(console.warn);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});

