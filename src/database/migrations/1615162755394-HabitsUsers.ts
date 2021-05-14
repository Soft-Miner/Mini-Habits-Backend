import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class HabitsUsers1615162755394 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'habits_users',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'user_id',
            type: 'varchar',
          },
          {
            name: 'habit_id',
            type: 'varchar',
          },
          {
            name: 'habit_challenge_id',
            type: 'varchar',
          },
          {
            name: 'experience',
            type: 'int',
          },
          {
            name: 'time_sunday',
            type: 'int',
          },
          {
            name: 'time_monday',
            type: 'int',
          },
          {
            name: 'time_tuesday',
            type: 'int',
          },
          {
            name: 'time_wednesday',
            type: 'int',
          },
          {
            name: 'time_thursday',
            type: 'int',
          },
          {
            name: 'time_friday',
            type: 'int',
          },
          {
            name: 'time_saturday',
            type: 'int',
          },
          {
            name: 'deleted',
            type: 'boolean',
          },
          {
            name: 'last_modified',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'FKUser',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FKHabit',
            referencedTableName: 'habits',
            referencedColumnNames: ['id'],
            columnNames: ['habit_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FKHabitChallenge',
            referencedTableName: 'habits_challenges',
            referencedColumnNames: ['id'],
            columnNames: ['habit_challenge_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('habits_users');
  }
}
