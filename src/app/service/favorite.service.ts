import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  constructor() {}

  private favoritesSubject = new BehaviorSubject<any[]>(this.loadFavorites());

  favorites$ = this.favoritesSubject.asObservable();

  private loadFavorites() {
    const data = localStorage.getItem('favorites');
    return data ? JSON.parse(data) : [];
  }

  addFavorite(favorite: any) {
    const favorites = this.loadFavorites();
    favorites.push(favorite);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    this.favoritesSubject.next(favorites); // notify all listeners
  }

  getFavorites() {
    return this.favoritesSubject.value;
  }
  removeFavorite(favorite: any) {
    const favorites = this.loadFavorites();

    const index = favorites.indexOf(favorite);

    if (index > -1) {
      favorites.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      this.favoritesSubject.next(favorites); // notify all listeners
    }
  }
}
