import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from 'src/app/core/service/socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('inputWrapper') inputWrapper: ElementRef<HTMLElement>;

  constructor(private socket: SocketService, private router: Router) { }

  ngOnInit() {
  }

  startGame(event: Event, code){
    event.preventDefault();
    this.socket.findGame(code).then(res => {
      if(res) this.router.navigate(['game/' + code])
      else {
        this.inputWrapper.nativeElement.classList.add('error')
        setTimeout(() => {
          this.inputWrapper.nativeElement.classList.remove('error')
        }, 800) 
      }
    });
  }

}
