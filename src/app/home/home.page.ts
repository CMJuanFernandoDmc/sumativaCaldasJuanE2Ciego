import { Component, OnInit, OnDestroy } from '@angular/core';
import { Database, object, ref, onValue, Unsubscribe, set } from '@angular/fire/database';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy{
  temperature: number = 0;
  mercuryHeight: string = '0%';
  animate: boolean = false;

  firebaseSubscription: Unsubscribe | null = null;

  constructor(private database: Database) {
    this.updateMercuryHeight();
  }

  ngOnDestroy(): void {
    if (this.firebaseSubscription) {
      this.firebaseSubscription = null;
    }
  }

  async ngOnInit(){
    await LocalNotifications.requestPermissions();//solicitar permisos de la app
    await LocalNotifications.schedule({//Elaboracion del objeto notificacion
      notifications: [
        {
          title: "Esta es una notificación emergente",
          body: "Esta notificación debería ejecutarse en segundo plano pero no cuando lapp esté cerrada",
          id: 1
        }
      ]
    });

    const route = ref(this.database, "/temperatura/intensidad");
    this.firebaseSubscription = onValue(route, snapshot => {
      const temperatureFromFirebase = snapshot.val();
      if (temperatureFromFirebase !== null && !isNaN(temperatureFromFirebase)) {
        this.temperature = temperatureFromFirebase;
        this.updateMercuryHeight();
      }
    });
  }

  updateMercuryHeight() {
    const percentage = this.temperature / 100;
    this.mercuryHeight = (percentage * 100) + '%';
  }

  getColor() {
    let color1: string;
    let color2: string;
    let percentage: number;
  
    if (this.temperature == 0) {
      return '#E8F7FA';
    } else if (this.temperature < 21) {
      color1 = '#E8F7FA';
      color2 = '#4F99D8';
      percentage = this.temperature / 20;
    } else if (this.temperature >= 21 && this.temperature < 60) {
      color1 = '#4F99D8';
      color2 = '#F0E901';
      percentage = (this.temperature - 21) / (60 - 21);
    } else if (this.temperature >= 60 && this.temperature < 74) {
      color1 = '#EDDB09';
      color2 = '#FF7107';
      percentage = (this.temperature - 60) / (74 - 60);
    } else if (this.temperature >= 74) {
      color1 = '#FF7107';
      color2 = '#D1362D';
      percentage = (this.temperature - 74) / (100 - 74);
    } else {
      return '#E8F7FA';
    }
  
    // Se utiliza para calcular los componentes de color interpolados
    const r = Math.round(parseInt(color1.substring(1, 3), 16) * (1 - percentage) + parseInt(color2.substring(1, 3), 16) * percentage);
    const g = Math.round(parseInt(color1.substring(3, 5), 16) * (1 - percentage) + parseInt(color2.substring(3, 5), 16) * percentage);
    const b = Math.round(parseInt(color1.substring(5, 7), 16) * (1 - percentage) + parseInt(color2.substring(5, 7), 16) * percentage);
  
    // Se combina los componentes de color interpolados en un color hexadecimal
    const finalColor = '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  
    return finalColor;
  }
  
  // Esta función nos ayuda para convertir un componente de color decimal en hexadecimal
  componentToHex(c: number) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  
}