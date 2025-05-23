/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Knex } from 'knex';
import { TestDatabases } from '@backstage/backend-test-utils';
import fs from 'fs';
import { migrationsDir } from './migrateBackendTasks';

const migrationsFiles = fs.readdirSync(migrationsDir).sort();

async function migrateUpOnce(knex: Knex): Promise<void> {
  await knex.migrate.up({ directory: migrationsDir });
}

async function migrateDownOnce(knex: Knex): Promise<void> {
  await knex.migrate.down({ directory: migrationsDir });
}

async function migrateUntilBefore(knex: Knex, target: string): Promise<void> {
  const index = migrationsFiles.indexOf(target);
  if (index === -1) {
    throw new Error(`Migration ${target} not found`);
  }
  for (let i = 0; i < index; i++) {
    await migrateUpOnce(knex);
  }
}

jest.setTimeout(60_000);

describe('migrations', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    '20250411000000_last_run.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20250411000000_last_run.js');

      await knex
        .insert({
          id: 'i',
          settings_json: '{}',
        })
        .into('backstage_backend_tasks__tasks');

      await expect(knex('backstage_backend_tasks__tasks')).resolves.toEqual([
        {
          id: 'i',
          settings_json: '{}',
          next_run_start_at: null,
          current_run_ticket: null,
          current_run_started_at: null,
          current_run_expires_at: null,
        },
      ]);

      await migrateUpOnce(knex);

      await knex
        .table('backstage_backend_tasks__tasks')
        .update({ last_run_error_json: 'error' })
        .where({ id: 'i' });

      await expect(knex('backstage_backend_tasks__tasks')).resolves.toEqual([
        {
          id: 'i',
          settings_json: '{}',
          next_run_start_at: null,
          current_run_ticket: null,
          current_run_started_at: null,
          current_run_expires_at: null,
          last_run_ended_at: null,
          last_run_error_json: 'error',
        },
      ]);

      await migrateDownOnce(knex);

      await expect(knex('backstage_backend_tasks__tasks')).resolves.toEqual([
        {
          id: 'i',
          settings_json: '{}',
          next_run_start_at: null,
          current_run_ticket: null,
          current_run_started_at: null,
          current_run_expires_at: null,
        },
      ]);

      await knex.destroy();
    },
  );
});
