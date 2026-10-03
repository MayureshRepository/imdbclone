import { handlePosterError } from '../shared/poster-fallback';
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
    handlePosterError(event);
  }

  deleteAll() {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '420px',
        maxWidth: 'calc(100vw - 32px)',
        panelClass: 'modern-dialog',
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
