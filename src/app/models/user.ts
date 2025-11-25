export class User {
  constructor() {
    this.id = null;
    this.role = "student";
    this.name = "";
    this.surname = "";
    this.patronymic = "";
    this.phoneNumber = "";
    this.group_id = 0;
  }

  id: number | null;
  role: "admin" | "teacher" | "student";
  name: string;
  surname: string;
  patronymic: string;
  phoneNumber: string;
  group_id!: number;
}
