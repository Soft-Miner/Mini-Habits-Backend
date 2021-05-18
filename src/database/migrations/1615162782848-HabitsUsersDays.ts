import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class HabitsUsersDays1615162782848 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'habits_users_days',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'habit_user_id',
            type: 'varchar',
          },
          {
            name: 'habit_challenge_id',
            type: 'varchar',
          },
          {
            name: 'completed_day',
            type: 'timestamp',
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
            name: 'FKHabitUser',
            referencedTableName: 'habits_users',
            referencedColumnNames: ['id'],
            columnNames: ['habit_user_id'],
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
    await queryRunner.dropTable('habits_users_days');
  }
}
