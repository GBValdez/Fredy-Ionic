import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-lever',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './lever.component.html',
  styleUrl: './lever.component.scss',
})
export class LeverComponent {
  @Output() rotateEvent = new EventEmitter<number>();
  rotate: number = 0;
  private direction: number = 1;
  clickRotate() {
    this.rotate += this.direction;
    this.rotateEvent.emit(this.rotate);
    if (Math.abs(this.rotate) == 1) this.direction *= -1;
  }
}
