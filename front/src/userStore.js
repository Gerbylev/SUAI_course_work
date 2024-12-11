import { makeAutoObservable } from "mobx";

class UserStore {
  isLogin = false;
  username = "";
  fullName = "";
  solvedTasks = 0;
  authToken = "";

  constructor() {
    makeAutoObservable(this);
  }

  login(userData) {
    this.isLogin = true;
    this.username = userData.username;
    this.fullName = userData.fullName;
    this.solvedTasks = userData.solvedTasks;
    this.authToken = userData.authToken;
  }

  logout() {
    
    this.isLogin = false;
    this.username = "";
    this.fullName = "";
    this.solvedTasks = [];
    this.authToken = "";
    localStorage.removeItem('authToken');
  }
}

export const userStore = new UserStore();
