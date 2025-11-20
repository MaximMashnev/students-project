export class User {
  constructor() {
    this.id = null;
    this.role = "student";
    this.name = "";
    this.surname = "";
    this.patronymic = "";
    this.phoneNumber = "";
    // this.groupIds = [];
    // this.group = 0;
  }

  id: number | null;
  role: "admin" | "teacher" | "student";
  name: string;
  surname: string;
  patronymic: string;
  phoneNumber: string;
  // groupIds?: number[];
  // group?: number;
}
