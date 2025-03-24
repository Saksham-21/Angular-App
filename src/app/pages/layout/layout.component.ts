import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDumbbell,faUsers,faHome,faBullseye,faChartLine,faRobot,faBars} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,RouterLink,FontAwesomeModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  faDumbbell = faDumbbell;
  faUsers=faUsers;
  faHome=faHome;
  faBullseye=faBullseye;
  faChartLine=faChartLine;
  faRobot=faRobot; 
  faBars=faBars;
  toggleBtn: HTMLElement | null = document.getElementById('toggle-btn');

  // toggleFunction(){
  //   console.log('toggleFunction');
  //   const sidebar = document.getElementById('sidebar');
  //   const content = document.getElementById('content');
        
  //   this.toggleBtn?.addEventListener('click', () => {
  //       if (sidebar) {
  //           sidebar.classList.toggle('collapsed');
  //       }
  //       if (content) {
  //           content.classList.toggle('expanded');
  //       }
  //   });
  // }
  toggleFunction() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    if (sidebar && content) {
      sidebar.classList.toggle('collapsed');
      content.classList.toggle('expanded');
    }
  }
}
