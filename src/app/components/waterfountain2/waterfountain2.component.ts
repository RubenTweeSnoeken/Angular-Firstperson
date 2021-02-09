import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-waterfountain2',
  templateUrl: './waterfountain2.component.html',
  styleUrls: ['./waterfountain2.component.scss']
})
export class Waterfountain2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var canvas = <HTMLCanvasElement>document.getElementById('canvas'),
      ctx = canvas.getContext('2d'),
      balls = [],
      numBalls = 500,
      gravity = 0.5,
      color = 0;


    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var Circle = function () {
      this.radius = 5;
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.vx = Math.random() * 2 - 1;
      this.vy = Math.random() * -10 - 10;
      this.color = 'red';
    };

    Circle.prototype.draw = function () {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    for (var i = 0; i < numBalls; ++i) {
      balls.push(new Circle());
    }

    function draw(ball) {
      ball.vy += gravity;
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.color = 'hsla(' + color + ', 100%, 50%, 1)';

      if (ball.x - ball.radius > canvas.width ||
        ball.x + ball.radius < 0 ||
        ball.y - ball.radius > canvas.height ||
        ball.y + ball.radius < 0
      ) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height;
        ball.vx = Math.random() * 4 - 1;
        ball.vy = Math.random() * -20 - 10;
      }

      ball.draw();
    }

    (function drawFrame() {
      requestAnimationFrame(drawFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      balls.forEach(draw);

      color++;
    })();
  }



}
