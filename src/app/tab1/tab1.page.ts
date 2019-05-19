import { Component, OnInit, AfterContentInit, ViewChild } from "@angular/core";
import { Geolocation } from '@ionic-native/geolocation/ngx';
declare var google;

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page implements OnInit, AfterContentInit {
  map: any;
  @ViewChild("mapElement") mapElement;

  locations = [
    [
      "Οδού Όθωνος Σύνταγμα",
      37.9748087,
      23.732627,
      "../../assets/bank.png",
      "../../assets/bank_active.png",
      "Όθωνος 8, Κέντρο, 10557 Αθήνα ",
      0.1,
      2
    ],
    [
      "Eurobank Andrianou",
      37.9731629,
      23.7271985,
      "../../assets/bank.png",
      "../../assets/bank_active.png",
      "Ανδριανού 8, Κέντρο, 10557 Αθήνα ",
      0.32,
      3
    ],
    [
      "Eurobank ATM",
      37.9708326,
      23.727069,
      "../../assets/bank.png",
      "../../assets/bank_active.png",
      "ΑΤΜ, Κέντρο, 10557 Αθήνα ",
      0.3,
      5
    ],
    [
      "Hellenic Post Bank",
      37.982889,
      23.7284691,
      "../../assets/postal.png",
      "../../assets/postal_active.png",
      "Πεσμαζόγλου 2, Αθήνα 105 59",
      0.5,
      7
    ]
  ];
  currentUserLat;
  currentUserLng;
  constructor(private geolocation: Geolocation) {}

  ngAfterContentInit(): void {
    this.loadMap();
  }
  ngOnInit(): void {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentUserLat = resp.coords.latitude;
      this.currentUserLng = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      this.currentUserLat = data.coords.latitude;
      this.currentUserLng = data.coords.longitude;
      // data.coords.latitude
      // data.coords.longitude
     });
  }

  addMarker(map: any) {
    let i = 0;
    let marker;
    for (i = 0; i < this.locations.length; i++) {
      marker = new google.maps.Marker({
        map: map,
        icon: { url: this.locations[i][3] },
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(
          this.locations[i][1],
          this.locations[i][2]
        )
      });

      this.addInfoWindow(marker, "", i);
    }
  }

  addInfoWindow(marker, content, i) {
    // let infoWindow = new google.maps.InfoWindow({
    //   content: content
    // });

    google.maps.event.addListener(marker, "click", () => {
      marker.setIcon(this.locations[i][4]);
      document.getElementById("infowindow").style.display = "block";
      document.getElementById("infoName").innerHTML = "" + this.locations[i][0];
      document.getElementById("infoAddress").innerHTML = "" + this.locations[i][5];
      document.getElementById("currentDistance").innerHTML = "" + this.locations[i][6];
      document.getElementById("remainingTime").innerHTML = "" + this.locations[i][7];
      // infoWindow.open(this.map, marker);
    });

    google.maps.event.addListener(marker, "closeclick", () => {
      marker.setIcon(this.locations[i][3]);
      document.getElementById("infoName").style.display = "none";
    });
  }

  loadMap() {
    const latLng = { lat: 37.9745068, lng: 23.7352651 };
    const mapOptions = {
      center: latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker(this.map);
  }

  locateUser(map: any) {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(
        this.currentUserLat,
        this.currentUserLng
      )
    });
  }

}
