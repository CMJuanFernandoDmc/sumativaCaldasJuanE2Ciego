import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Luz',
  webDir: 'www',
  plugins: {
    LocalNotifications: {
      smallIcon: "src/assets/icon/termometro.png",//Icono de la app solo para Android
      iconColor: "#ff8000",//Color de Icono
      sound: "src/assets/sonido/sonido1.wav",//Sonido de la notificacion solo para Android
    },
  },
};

export default config;