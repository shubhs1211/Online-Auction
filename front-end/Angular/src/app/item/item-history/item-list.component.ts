import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';

import { Item } from '../../models/Item';
import { ItemService } from '../../services/item.service';
import { User } from 'src/app/models/User';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({

    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit, OnDestroy {
  user: User;
  isEdit = false;
  isAdmin = false;
  error: String = '';
  profileLoading: Boolean = true;

  items: Item[] = [];
  isLoading = false;
  private itemSub: Subscription;
  // To add a service , add a constructor
  constructor(public itemService: ItemService, private profileService: ProfileService, private authService: AuthenticationService) {


  }

  ngOnInit() {
    this.isLoading = true;
    this.itemService.getItems();
    this.itemSub = this.itemService.getItemUpdateListener().subscribe((items: Item[]) => {
        this.isLoading = false;
        this.items = items;
    });

    this.profileService.getUserDetails().subscribe(
      (data) => {
        const user_data = data['data'];
        user_data['role'] = this.authService.getRole();
        this.user = Object.assign(new User, user_data);
        this.isAdmin = this.user.role.toLowerCase() === 'admin';
        this.error = '';
        this.profileLoading = false;
      },
      (err) => {
        console.log(err);
        this.error = 'Failed to fetch User Details.';
        this.profileLoading = false;
      }
    );

  }

  ngOnDestroy() {
    this.itemSub.unsubscribe();
  }

  deleteItem(id: string) {
    this.itemService.deleteItem(id);
  }

  saveProfile() {
    this.isEdit = !this.isEdit;
  }

}


