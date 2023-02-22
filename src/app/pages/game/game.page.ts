import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  public game = {
    type: 'Online',
    points: 501,
    mode: 'double',
    legs: 1,
  };

  constructor() {}

  ngOnInit() {}
}
