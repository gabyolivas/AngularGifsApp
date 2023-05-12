import { Component, Input, OnInit } from '@angular/core';
import { Gifs } from '../../interfaces/gifs.interfaces';

@Component({
  selector: 'gifs-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent implements OnInit {
  
  ngOnInit(): void {
    if ( !this.gif )
    throw new Error('Gif property is required');
  }
 
  @Input()
  public gif!: Gifs;
  
}
