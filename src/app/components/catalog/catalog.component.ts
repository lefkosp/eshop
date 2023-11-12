import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('300ms ease')),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '300ms ease-in',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class CatalogComponent implements OnInit {
  public allProducts: any = undefined;
  public filteredProducts: any;
  public filters: any = {
    search: '',
    minPrice: null,
    maxPrice: null,
    inStock: false,
    preorder: false,
  };
  public showFilters = false;
  public sortMethod = 'priceAsc';
  public pageSize = 10;
  public pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: this.pageSize,
    length: 10,
  };

  constructor(private productsService: ProductsService) {}

  public ngOnInit() {
    this.productsService.getAllProducts().subscribe((prod: any) => {
      this.allProducts = prod.map((product: any, index: number) => {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        const inStock = randomNumber % 2 === 0;
        const preorder = inStock
          ? false
          : Math.floor(Math.random() * 100 + 1) % 2 === 0;

        return {
          ...product,
          inStock,
          preorder,
        };
      });
      this.applyFilters();
    });
  }

  public applyFilters(): void {
    const filtersExist =
      this.filters.search ||
      this.filters.minPrice !== null ||
      this.filters.maxPrice !== null ||
      this.filters.inStock ||
      this.filters.preorder;

    this.filteredProducts = filtersExist
      ? this.allProducts.filter((product: any) => {
          const matchesSearch = product.title
            .toLowerCase()
            .includes(this.filters.search.toLowerCase());
          const matchesMinPrice =
            this.filters.minPrice === null ||
            product.price >= this.filters.minPrice;
          const matchesMaxPrice =
            this.filters.maxPrice === null ||
            product.price <= (this.filters.maxPrice || Number.MAX_SAFE_INTEGER);
          const matchesInStock = !this.filters.inStock || product.inStock;
          const matchesPreorder = !this.filters.preorder || product.preorder;
          return (
            matchesSearch &&
            matchesMinPrice &&
            matchesMaxPrice &&
            matchesInStock &&
            matchesPreorder
          );
        })
      : this.allProducts;

    switch (this.sortMethod) {
      case 'priceAsc':
        this.filteredProducts.sort((a: any, b: any) => a.price - b.price);
        break;
      case 'priceDesc':
        this.filteredProducts.sort((a: any, b: any) => b.price - a.price);
        break;
      case 'nameAsc':
        this.filteredProducts.sort((a: any, b: any) =>
          a.title
            .toLowerCase()
            .trim()
            .localeCompare(b.title.toLowerCase().trim())
        );
        break;
      case 'nameDesc':
        this.filteredProducts.sort((a: any, b: any) =>
          b.title
            .toLowerCase()
            .trim()
            .localeCompare(a.title.toLowerCase().trim())
        );
        break;
    }
    this.pageEvent.length = this.filteredProducts.length;

    const maxPageIndex =
      Math.ceil(this.filteredProducts.length / this.pageEvent.pageSize) - 1;

    if (
      this.pageEvent.pageIndex > maxPageIndex ||
      this.pageEvent.pageIndex === -1
    ) {
      this.pageEvent.pageIndex = maxPageIndex;
    }

    const startIndex = this.pageEvent.pageIndex * this.pageEvent.pageSize;
    const endIndex = startIndex + this.pageEvent.pageSize;
    this.filteredProducts = this.filteredProducts.slice(startIndex, endIndex);
    console.log(this.pageEvent);
  }

  public updateImageOnError(event: any) {
    event.target.src = 'https://i.imgur.com/BG8J0Fj.jpg';
  }
}
