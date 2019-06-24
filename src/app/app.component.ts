import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CockPit';
  flag = 0;

  removeElement(sidebarElement, welcomeElement){
    var sideElement = document.getElementById(sidebarElement);
    sideElement.style.display = "block";
    if (document.getElementById(welcomeElement)) {     
         var child = document.getElementById(welcomeElement);
        //  var parent = document.getElementById(pageContentWrapper);
         child.remove();
        //  parent.removeChild(child);
    }
  }

  removeElement1(welcomeElement){
    if (document.getElementById(welcomeElement)) {     
         var child = document.getElementById(welcomeElement);
        //  var parent = document.getElementById(pageContentWrapper);
         child.style.display = "block";
        //  parent.removeChild(child);
    }
  }

}
