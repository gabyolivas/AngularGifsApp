import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gifs, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifsList: Gifs[] = [];
  
  private _tagsHistory: string[] = [];
  private apiKey    :string = "XJtgMmdvnun0FU5rjGeW35A6MkAY7ho9";
  private serviceURL: string = "https://api.giphy.com/v1/gifs";

  constructor( private http: HttpClient ) { 
    this.loadLocalStorage();
    this.getFirstLoad();    
  }

  get tagsHistory(){
    return [...this._tagsHistory];
  }

  private getFirstLoad(): void {
    if ( this._tagsHistory.length == 0 ) return;

    const firstGif = this._tagsHistory[0];
    this.searchTag( firstGif );
  }

  private saveLocalStorage(): void {
    localStorage.setItem("History", JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if ( !localStorage.getItem("History") ) return;
    
    const datosLocal  = localStorage.getItem("History");
    this._tagsHistory = JSON.parse( datosLocal! );
  }

  private organizeHistory ( tag: string ): void {
     
    /* 
      Genera 3 validaciones antes de insertar en el arreglo
      1. Valida que el valor del tag no sea vacío
      2. Valida que el elemento no exista en el arreglo, si existe, lo elimina antes de insertar de nuevo
      3. Valida que no haya más de 10 elementos en la lista, si existen, va elimienando el más antiguo
    */
      
      tag = tag.toLowerCase();
    
      if ( !tag ) return;

      const index = this._tagsHistory.findIndex( i => i === tag );      
      if ( index > -1 ) 
        this._tagsHistory.splice(index, 1);
  
      if ( this._tagsHistory.length >= 10 ) 
        this._tagsHistory.pop();
      
      this._tagsHistory.unshift( tag );
      this.saveLocalStorage();
  }

  public searchTag( tag: string ): void {
    
      this.organizeHistory( tag ); 
      const params = new HttpParams()
            .set("api_key", this.apiKey)
            .set("limit"  , "10"       )
            .set("q"      , tag        );

      this.http.get<SearchResponse>(`${this.serviceURL}/search`, { params })
          .subscribe( resp => {
            
            this.gifsList = resp.data;
      } );
  }
}
