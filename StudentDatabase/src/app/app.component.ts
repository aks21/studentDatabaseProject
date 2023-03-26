import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'StudentDatabase';
  displayedColumns: string[] = ['studentName', 'studentAge','studentMarks', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService) {}
  ngOnInit(): void {
    this.getAllStudents();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val =>{
if(val == 'save'){
  this.getAllStudents();
}
    })
  }
  getAllStudents(){
    this.api.getStudent()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("error fetching data")
      }    
    })
  }
  editStudent(row: any){
    this.dialog.open(DialogComponent,{
    width:'30%',
    data: row
      }).afterClosed().subscribe(val=>{
        if(val == 'update'){
          this.getAllStudents();
        }
      })  
  }
  deleteStudent(id:number){
     this.api.deleteStudent(id)
     .subscribe   ({
      next: (res)=>{
        this.getAllStudents();
      },
      error:()=>{
        alert("error whiled deleting student");
      }
     })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
