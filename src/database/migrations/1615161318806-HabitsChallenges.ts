import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class HabitsChallenges1615161318806 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'habits_challenges',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'habits_id',
            type: 'varchar',
          },
          {
            name: 'level',
            type: 'int',
          },
          {
            name: 'icon',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'xp_reward',
            type: 'int',
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
            name: 'FKHabit',
            referencedTableName: 'habits',
            referencedColumnNames: ['id'],
            columnNames: ['habits_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('habits_challenges');
  }
}
