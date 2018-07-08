import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import * as globals from '../globals'

/**
 *  roomRs
 *
 **/

@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.css']
})

export class DashboardPanelComponent  implements OnInit {

  constructor(private http:HttpClient, private _notifications: NotificationsService) { }

  aule = [];
  roomRs = { orario1 : "", orario2 : "", data: "",
                 IdClass: "", prof: "", descrizione: "",
                 token: globals.getToken()
                };
  data = "";

  ngOnInit() {
    this.http.get(globals.API + "aule").subscribe((data) => {
      this.aule = data["aule"];
    });
  }

  booking() {
    if (this.data != null && this.data != "")
       this.roomRs.data = this.data.replace(/-/g, "");
    else {
          console.log("errore: inserisci data!");
          this._notifications.create("Prenotazione", "Inserisci la data!", "error", globals.confNotifications);
          return;
    }

    if (this.roomRs.IdClass == null || this.roomRs.IdClass == "") {
      this._notifications.create("Prenotazione", "Inserisci l'aula!", "error", globals.confNotifications);
      return;
    }

    if (this.roomRs.orario1.substring(0, 2) >= this.roomRs.orario2.substring(0, 2)) {
      this._notifications.create('Prenotazione', 'Intervallo di orario errato', 'error', globals.confNotifications);
      return;
    }
    this.http.post(globals.API + 'prenota', this.roomRs).subscribe((data) => {
    });
  }

}
