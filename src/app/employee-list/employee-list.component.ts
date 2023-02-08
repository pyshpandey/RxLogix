import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees = [];
  orgEmployees = [];
  showAddEmployeePopup = false;
  addEmployeeForm: FormGroup;
  filterEmployeeForm: FormGroup;
  employeeId: number;
  isEmpDelete = true;

  constructor(
    private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.filterEmployeeForm = this.formBuilder.group({
      name: [''],
      jobTitle: [''],
      age: [''],
    });
    this.addEmployeeForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      age: ['', [Validators.required]],
    });
    this.orgEmployees = this.employees;
  }

  isNumber(event) {
    event = (event) ? event : window.event;
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  showEmployeePopup() {
    this.showAddEmployeePopup = true;
  }

  addEmployee() {
    if (this.addEmployeeForm.valid) {
      if (this.employeeId >= 0) {
        const empIndex = this.employees.findIndex(obj => obj.id === this.employeeId);
        this.employees[empIndex].name = this.addEmployeeForm.value.name;
        this.employees = this.employees.map((obj, index) => {
          if (index === empIndex) {
            return {
              ...obj,
              name: this.addEmployeeForm.value.name,
              jobTitle: this.addEmployeeForm.value.jobTitle,
              age: this.addEmployeeForm.value.age
            };
          }
          return obj;
        });
        this.employeeId = -1;
      } else {
        this.employees.push({
          id: this.employees.length + 1,
          name: this.addEmployeeForm.value.name,
          jobTitle: this.addEmployeeForm.value.jobTitle,
          age: this.addEmployeeForm.value.age
        });
      }
      this.addEmployeeForm.reset();
      this.checkEmpDelete();
      this.showAddEmployeePopup = false;
    }
  }

  showEmployee(empId: number) {
    this.showAddEmployeePopup = true;
    const empRes = this.employees.find(obj => obj.id === empId);
    this.employeeId = empId;
    this.addEmployeeForm.patchValue({
      name: empRes.name,
      jobTitle: empRes.jobTitle,
      age: empRes.age
    });

  }

  deleteEmployee(empId: number) {
    this.employees.splice(this.employees.findIndex(obj => obj.id === empId), 1);
    this.checkEmpDelete();
  }

  checkEmpDelete() {
    if (this.employees.length === 1) {
      this.isEmpDelete = false;
    } else {
      this.isEmpDelete = true;
    }
  }

  filterEmployee() {
    this.orgEmployees = this.employees;
    this.employees = this.employees.filter(employee => {
      return employee.name.toLowerCase().includes(this.filterEmployeeForm.value.name) ||
      employee.jobTitle.toLowerCase().includes(this.filterEmployeeForm.value.jobTitle) ||
      Number(employee.age) === Number(this.filterEmployeeForm.value.age);
    });
  }

  resetFilter() {
    this.filterEmployeeForm.reset();
    this.employees = this.orgEmployees;
  }

}
