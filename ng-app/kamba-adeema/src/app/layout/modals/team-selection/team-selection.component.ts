import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-team-selection',
  templateUrl: './team-selection.component.html',
  styleUrls: ['./team-selection.component.scss']
})
export class TeamSelectionComponent implements OnInit {

  left = '';
  right = '';

  constructor(public dataService: DataService, private dialogRef: MatDialogRef<TeamSelectionComponent>) { }

  ngOnInit(): void {
  }

  setTeam(side, team){
    this[side] = team;
  }

  close(){
    this.dialogRef.close({left: this.left, right: this.right});
  }
}
