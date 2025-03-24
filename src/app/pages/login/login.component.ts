import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginObj: any = {
    Role: '',
    Username: '',
    password: '',
  };
  http = inject(HttpClient);
  router = inject(Router);
  onLogin() {
    console.log(this.loginObj);
    this.router.navigateByUrl('home')
    // debugger;
    // this.http
    //   .post('http://localhost:3000/login', this.loginObj)
    //   .subscribe((res: any) => {
    //     console.log(res);
    //     debugger;
    //     if (res.result) {
    //       localStorage.setItem('employeeApp', JSON.stringify(res.data));
    //       this.router.navigateByUrl('dashboard');
    //     } else {
    //       alert(res.message);
    //     }
    //   });
  }
}
