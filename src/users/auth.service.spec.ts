import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });
  it('can create an instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup('asdf@gmail.com', 'asdf');

    expect(user.password).not.toEqual('asdf');

    const [salted, hash] = user.password.split('.');
    expect(salted).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@gmail.com', 'asdf');
    await expect(service.signup('asdf@gmail.com', 'asdf')).rejects.toThrow();
  });

  it('throws if signin is called with an unused email', () => {
    expect(service.signup('asdf@gmail.com', 'asdf'));
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('asdf@gmail.com', 'asdf');
    await expect(service.signup('asdf@gmail.com', 'assssdf')).rejects.toThrow();
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdf@gmail.com', 'asdf');
    const user = await service.signin('asdf@gmail.com', 'asdf');
    expect(user).toBeDefined();
  });
});
