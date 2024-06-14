import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "ns-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  taskForm: FormGroup;
  tasks: any[] = [];
  statusList: string[] = ["Tamamlandı", "Devam Ediyor", "İptal Edildi"];
  apiUrl: string = "https://jsonplaceholder.typicode.com/todos";

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.taskForm = this.fb.group({
      title: ["", Validators.required],
      status: [0, Validators.required], // Using index for DropDown
    });
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (tasks) => {
        this.tasks = tasks.slice(0, 3); // Limiting to 10 tasks for demo
      },
      (error) => {
        console.error("Error loading tasks", error);
      }
    );
  }

  onSubmit() {
    const newTask = {
      title: this.taskForm.value.title,
      status: this.statusList[this.taskForm.value.status], // Convert index to status
    };

    this.http.post(this.apiUrl, newTask).subscribe(
      (task) => {
        this.tasks.push(task);
        this.taskForm.reset();
      },
      (error) => {
        console.error("Error adding task", error);
      }
    );
  }

  editTask(task) {
    this.taskForm.setValue({
      title: task.title,
      status: this.statusList.indexOf(task.status),
    });
  }
}
