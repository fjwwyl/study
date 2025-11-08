interface Permission {

}


interface Role {

}

interface user {
  id: string;
  roles: string[]
}

class Auth {
  currentUser: user

  private constructor() {
    const currentUser = JSON.parse(<string>localStorage.getItem('currentUser')) || {};
    this.currentUser = {
      id: currentUser.id || "",
      roles: currentUser.roles || [],
    }
  }

  private static instance: Auth | null = null;

  static getInstance() {
    if (Auth.instance === null) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  public setCurrentUser(userId: string, roles: string[]): void {
    this.currentUser.id = userId;
    this.currentUser.roles = roles;
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
  }

  public clearCurrentUser(): void {
    this.currentUser.id = "";
    this.currentUser.roles = [];
    localStorage.removeItem('currentUser');
  }
}

export const auth = Auth.getInstance();