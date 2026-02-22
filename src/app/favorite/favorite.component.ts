import { Component, inject, OnInit } from '@angular/core';
import { GetmoviedataService } from '../service/getmoviedata.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { FavoriteService } from '../service/favorite.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css',
})
export class FavoriteComponent implements OnInit {
  favriteService= inject(FavoriteService);
  constructor(private dialog: MatDialog) {}
  favoriteFromLocalStorage: any[] = [];
  movieSearchService = inject(GetmoviedataService);
  movieData: any[] = [];
  router = inject(Router);

  ngOnInit() {
    this.getFavoriteFromLocalStorage();
  }
  getFavoriteFromLocalStorage() {
    const favoriteFromLocalStorage1 = localStorage.getItem('favorites');
    if (favoriteFromLocalStorage1) {
      this.favoriteFromLocalStorage = JSON.parse(favoriteFromLocalStorage1);
    }
    this.movieData = [];
    for (var i = 0; i < this.favoriteFromLocalStorage.length; i++) {
      this.movieSearchService
        .getMovieData(this.favoriteFromLocalStorage[i])
        .subscribe({
          next: (data: any) => {
            this.movieData.push(data);
          },
          error: (error: any) => {
            console.error('Error fetching data:', error);
          },
        });
    }
  }

  onSelect(id: any) {
    this.router.navigate(['/details', id.imdbID]);
  }

  //Remove Fvorite
  removeFromFavorites(idtoremove: string) {
    const favoriteFromLocalStorage1 = localStorage.getItem('favorites');
    if (favoriteFromLocalStorage1) {
      this.favoriteFromLocalStorage = JSON.parse(favoriteFromLocalStorage1);
    }
    for (var i = 0; i < this.favoriteFromLocalStorage.length; i++) {
      if (this.favoriteFromLocalStorage[i] == idtoremove) {
        this.favoriteFromLocalStorage.splice(i, 1);
         this.favriteService.removeFavorite(idtoremove);
        localStorage.setItem(
          'favorites',
          JSON.stringify(this.favoriteFromLocalStorage)
        );
        break;
      }
    }
    this.getFavoriteFromLocalStorage();
    
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    // Prevent infinite loop - only handle error once
    if (!imgElement.hasAttribute('data-error-handled')) {
      imgElement.setAttribute('data-error-handled', 'true');
      // Use a data URI instead of external file to avoid 404 errors
      imgElement.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2216%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo Image%3C/text%3E%3C/svg%3E';
      imgElement.removeEventListener('error', this.onImageError.bind(this));
    }
  }

  deleteAll() {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '500px',
        height: '300px',
        data: {
          title: 'Confirm Deletion',
          message: 'Are you sure you want to delete all favorites?',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          console.log("result",result );
         this.favriteService.removeAllFavorites();
          this.movieData = [];



        }
      });
  }
}
