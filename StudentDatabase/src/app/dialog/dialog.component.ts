import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
@Component({

  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  studentForm !: FormGroup
  actionBtn : string = "Add"
  constructor(private formBuilder : FormBuilder, 
    private api : ApiService, 
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef : MatDialogRef<DialogComponent>) { }
 
  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      studentName: ['', Validators.required],
      studentAge: ['', Validators.required],
      studentMarks: ['', Validators.required]
    });
    if(this.editData){
      this.actionBtn = "Update";
      this.studentForm.controls['studentName'].setValue(this.editData.studentName);
      this.studentForm.controls['studentAge'].setValue(this.editData.studentAge);
      this.studentForm.controls['studentMarks'].setValue(this.editData.studentMarks);
    }
  }
addStudent(){
 if(!this.editData){
  if(this.studentForm.valid){
    this.api.postStudent(this.studentForm.value)
    .subscribe({
      next:(res)=>{
        this.studentForm.reset();
        this.dialogRef.close('save');
      },
  error:()=>{
    alert("error while adding Student details")
  }
  
    })
    }
  }
    else{
      this.updateStudent()
    }
 }
updateStudent(){
  this.api.putStudent(this.studentForm.value,this.editData.id)
.subscribe({
  next:(res)=>{
    this.studentForm.reset();
    this.dialogRef.close('update');

  },
  error:()=>{
    alert("error while updating details");
  }

}) 
}
}
