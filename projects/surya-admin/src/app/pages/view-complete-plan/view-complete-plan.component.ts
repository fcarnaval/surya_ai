import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-view-complete-plan',
  templateUrl: './view-complete-plan.component.html',
  styleUrl: './view-complete-plan.component.scss'
})
export class ViewCompletePlanComponent implements OnInit {
  userId: string = '';
  userName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    // Get parameters from route
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.userName = decodeURIComponent(params['userName']);
    });
  }

  goBack() {
    this.location.back();
  }
}
