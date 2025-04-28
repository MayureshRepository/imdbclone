import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GettvshowdataService {
  constructor(private http:HttpClient) { }

  getTVShowsData(tvshowname:string){
    return this.http.get(`https://www.omdbapi.com/?apikey=b3d9a4e0&i=${encodeURIComponent(tvshowname)}`);
}


    
}