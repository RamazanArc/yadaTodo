import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApplicationSettings } from "@nativescript/core";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, public router: Router) {
    this.registerForm = this.fb.group({
      username: ["", Validators.required],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(10),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, password } = this.registerForm.value;

      // Save username and password to local storage
      ApplicationSettings.setString(username, password);
      console.log("User registered successfully");

      this.router.navigate(["/login"]);
    } else {
      console.log("Form is invalid");
    }
  }
}
