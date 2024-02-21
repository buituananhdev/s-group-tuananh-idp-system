import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (await this.userRepository.findOne({ where: { username: createUserDto.username } })) {
      /**
       *  Avoid using native Http Exception, use custom exception instead:
       *  - There can be many duplicate http status code like 400, 422 - hard for handle specific business
       *  - Instead, custom exception that bound business code and message is better
       *
       *  For example:
       *  throw new UserAlreadyExistsException();
       *  // export class UserAlreadyExistsException extends NotFoundException {
       *  //   constructor() {
       *  //     super('User already exists');
       *  //     this.code = 'USER_ALREADY_EXISTS'; // This is the target business code
       *  //   }
       *  // }
       */
      throw new NotFoundException('User already exists');
    } // Spacing after the if statement for separate code of blocks

    /**
     * Get this from config - not hard code, by the way
     * This is rounds not saltOrRounds, please correct it
     * Prefer using salt with secret key instead of rounds only
     */
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);

    // Spacing between different actions
    const user = this.userRepository.create({ ...createUserDto, password: hash });
    return await this.userRepository.save(user);
  }

  /**
   * Missing pagination for api get user, please update this
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * Encapsulate the Query Model into a separate class
   * - This should not public the generic of typeorm out of the service.
   * - Service is closed to focus on business domain
   *
   * Case 1:
   * If from role service, you are targeting to getRolesByUserId,
   * you should public this method from userService#getRolesByUserId instead
   * async getRolesByUserId(userId: number): Promise<Role[]> {
   *    const user = await this.userServices.findOne({
   *      where: { id: userId },
   *      relations: ['roles'],
   *    });
   *
   *    return user.roles;
   *  }
   *
   *  Case 2:
   *  You are targeting get user detail which is business purpose,
   *  you should public this method from userService#findDetailById to provide nesseary detail
   *  to api get user detail
   */
  async findOne(query?: any): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail(query);
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // What if it failed, how should client handle this error?
    const user = await this.userRepository.findOneOrFail({ where: { id } });

    /**
     * What if merged and save failed, what is the status client need to handle?
     * Are you allowing to modify password, username, createdAt, ...?
     * Not much information should be modify, please update this
     */
    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async updateRoles(id: number, roles: Role[]): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    this.userRepository.merge(user, { roles });
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    // What happens with the related data, should it be removed as well?
    await this.userRepository.remove(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { username } });
  }
}
