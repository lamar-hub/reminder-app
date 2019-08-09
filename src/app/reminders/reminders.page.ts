import {Component, OnInit} from '@angular/core';
import {ImageService} from './account/image.service';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.page.html',
  styleUrls: ['./reminders.page.scss'],
})
export class RemindersPage implements OnInit {

  constructor(private imageService: ImageService) {
  }

  ngOnInit() {
    this.imageService.fetchImage().subscribe();
  }

}
