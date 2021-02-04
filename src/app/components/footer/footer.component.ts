import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.getYearCopyRight();
  }


  getYearCopyRight() {
    var dt = new Date();
    var str = document.getElementById("year").innerHTML;
    var lines = str.split("\n");
    for (var i = 0; i < lines.length; i++) {
      lines[i] = "© " + dt.getFullYear().toString() + " " + lines[i];
    }
    document.getElementById("year").innerHTML = lines.join("\n");
  }

}
