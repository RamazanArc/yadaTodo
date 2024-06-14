import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
// import * as localStorage from "nativescript-localstorage";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
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
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      console.log({ username, password });

      //   // Save username and password to local storage
      //   localStorage.setItem("username", username);
      //   localStorage.setItem("password", password);

      //   // Simulate token generation and save to local storage
      //   const token = "your-obtained-token";
      //   localStorage.setItem("token", token);

      this.router.navigate(["/dashboard"]);
    } else {
      console.log("Form is invalid");
    }
  }

  onForgotPassword() {
    console.log("Forgot password clicked");
    // Implement forgot password logic here
  }
  onRegister() {
    this.router.navigate(["/register"]);
  }
}
