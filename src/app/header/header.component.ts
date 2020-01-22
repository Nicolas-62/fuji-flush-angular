import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  disabled: boolean = true;
  ngOnInit() {
  }
  inProgress() {   
    alert("cette page est en cours de développement");
  }
}
