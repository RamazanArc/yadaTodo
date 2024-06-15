import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { ApplicationSettings } from "@nativescript/core";
import { Router } from "@angular/router";
import { Vibrate } from "nativescript-vibrate";

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
  username: string = "";
  vibrator: Vibrate;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ["", Validators.required],
      status: [0, Validators.required],
    });
    this.vibrator = new Vibrate();
  }

  ngOnInit() {
    this.username = ApplicationSettings.getString("username", "");
    this.loadTasks();
  }

  loadTasks() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (tasks) => {
        this.tasks = tasks.slice(0, 3);
      },
      (error) => {
        console.error("Error loading tasks", error);
      }
    );
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const newTask = {
        title: this.taskForm.value.title,
        status: this.statusList[this.taskForm.value.status],
        completed: false,
      };

      this.http.post<any>(this.apiUrl, newTask).subscribe(
        (task) => {
          this.tasks.unshift(task);
          this.taskForm.reset();
          this.vibrator.vibrate(1000);
        },
        (error) => {
          console.error("Error adding task", error);
        }
      );
    }
  }

  editTask(task) {
    this.taskForm.setValue({
      title: task.title,
      status: this.statusList.indexOf(task.status),
    });
  }

  deleteTask(task) {
    const deleteUrl = `${this.apiUrl}/${task.id}`;

    this.http.delete(deleteUrl).subscribe(
      () => {
        this.tasks = this.tasks.filter((t) => t.id !== task.id);
      },
      (error) => {
        console.error("Error deleting task", error);
      }
    );
  }

  updateTask(task) {
    const updateUrl = `${this.apiUrl}/${task.id}`;

    const updatedTask = {
      title: this.taskForm.value.title,
      status: this.statusList[this.taskForm.value.status],
      completed: task.completed,
    };

    this.http.put<any>(updateUrl, updatedTask).subscribe(
      (response) => {
        const index = this.tasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = response;
          this.taskForm.reset();
          this.vibrator.vibrate(1000); // 1 saniye titret
        }
      },
      (error) => {
        console.error("Error updating task", error);
      }
    );
  }

  logout() {
    ApplicationSettings.remove("token");
    ApplicationSettings.remove("username");
    this.router.navigate(["/login"]);
  }
}
