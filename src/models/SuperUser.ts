import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('super_users')
class SuperUser {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  refresh_token: string;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export default SuperUser;
