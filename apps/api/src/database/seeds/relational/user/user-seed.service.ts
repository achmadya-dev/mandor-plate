import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { RoleEnum } from '../../../../roles/roles.enum';
import { StatusEnum } from '../../../../statuses/statuses.enum';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async run() {
    await this.ensureDemoUser({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@example.com',
      roleId: RoleEnum.admin,
      roleName: 'admin',
    });
    await this.ensureDemoUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      roleId: RoleEnum.user,
      roleName: 'user',
    });
  }

  private async ensureDemoUser(input: {
    firstName: string;
    lastName: string;
    email: string;
    roleId: RoleEnum;
    roleName: string;
  }) {
    const existing = await this.repository.findOne({
      where: { email: input.email },
      withDeleted: true,
    });

    if (existing && !existing.deletedAt) return;

    const password = await bcrypt.hash('secret', await bcrypt.genSalt());
    if (existing) await this.repository.restore(existing.id);

    await this.repository.save(
      this.repository.create({
        id: existing?.id,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password,
        role: { id: input.roleId, name: input.roleName },
        status: { id: StatusEnum.active, name: 'Active' },
      }),
    );
  }

  async bootstrapAdmin(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const existing = await this.repository.findOne({
      where: { email: input.email },
      relations: { role: true },
      withDeleted: true,
    });

    if (existing) {
      if (existing.deletedAt) {
        throw new Error(
          `BOOTSTRAP_ADMIN_EMAIL belongs to a deleted user: ${input.email}`,
        );
      }
      if (existing.role?.id !== RoleEnum.admin) {
        throw new Error(
          `BOOTSTRAP_ADMIN_EMAIL already belongs to a non-admin user: ${input.email}`,
        );
      }
      return;
    }

    const password = await bcrypt.hash(input.password, await bcrypt.genSalt());
    await this.repository.save(
      this.repository.create({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password,
        role: { id: RoleEnum.admin, name: 'admin' },
        status: { id: StatusEnum.active, name: 'Active' },
      }),
    );
  }
}
