import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entity/category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async findAllCategory(): Promise<Category[]> {
    try {
      const categories = await this.createQueryBuilder('categories')
        .leftJoinAndSelect('categories.boards', 'boards')
        .where('categories.no = boards.category')
        .getMany();

      return categories;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findOneCategory(no: number): Promise<Category> {
    try {
      const category = await this.createQueryBuilder('categories')
        .leftJoinAndSelect('categories.boards', 'boards')
        .leftJoinAndSelect('categories.users', 'users')
        .select([
          'categories.no',
          'categories.name',
          'boards.no',
          'boards.title',
          'boards.description',
          'users.no',
          'users.email',
          'users.nickname',
        ])
        .where('categories.no = :no', { no })
        // .andWhere('categories.no = boards.category')
        // .andWhere('categories.no = users.categories')
        .getOne();

      return category;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async selectCategory(categories: Array<number>) {
    const categoryInfo = {
      first: await this.createQueryBuilder('categories')
        .select()
        .where('categories.no = :no', { no: categories[0] })
        .getOne(),
      second: await this.createQueryBuilder('categories')
        .select()
        .where('categories.no = :no', { no: categories[1] })
        .getOne(),
      third: await this.createQueryBuilder('categories')
        .select()
        .where('categories.no = :no', { no: categories[2] })
        .getOne(),
    };
    return categoryInfo;
  }
  async saveUsers(categories, user) {
    try {
      const { first, second, third } = categories;
      const saveUsers = {
        firstCategory: await this.findOne(first.no, {
          relations: ['users'],
        }),
        secondCategory: await this.findOne(second.no, {
          relations: ['users'],
        }),
        thirdCategory: await this.findOne(third.no, {
          relations: ['users'],
        }),
      };
      const { firstCategory, secondCategory, thirdCategory } = saveUsers;

      firstCategory.users.push(user);
      secondCategory.users.push(user);
      thirdCategory.users.push(user);

      this.save(firstCategory);
      this.save(secondCategory);
      this.save(thirdCategory);
    } catch (e) {
      throw e;
    }
  }
}
