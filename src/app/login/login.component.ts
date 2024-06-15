import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApplicationSettings } from "@nativescript/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
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
      const registeredPassword = ApplicationSettings.getString(username);

      if (registeredPassword && registeredPassword === password) {
        console.log("Login successful");

        // Simulate token generation and save to local storage
        const token = "your-obtained-token";
        ApplicationSettings.setString("token", token);

        this.router.navigate(["/dashboard"]);
      } else {
        console.log("User not registered or invalid password");
        alert("Kullanıcı kayıtlı değil veya şifre yanlış.");
      }
    } else {
      console.log("Form is invalid");
    }
  }

  onRegister() {
    this.router.navigate(["/register"]);
  }
}
