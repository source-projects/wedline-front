import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-plan-upgrade',
  templateUrl: './plan-upgrade.component.html',
  styleUrls: ['./plan-upgrade.component.css']
})
export class PlanUpgradeComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PlanUpgradeComponent>
  ) {}

  ngOnInit(): void {
  }
  
}
