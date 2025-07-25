/*
 * Copyright 2025 The Backstage Authors
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
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { KafkaConsumerClient } from '../publisher/KafkaConsumerClient';
import { eventsServiceRef } from '@backstage/plugin-events-node';

/**
 * Kafka module for the Events plugin.
 *
 * @public
 */
export const eventsModuleKafkaConsumingEventPublisher = createBackendModule({
  pluginId: 'events',
  moduleId: 'kafka-consuming-event-publisher',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        events: eventsServiceRef,
        logger: coreServices.logger,
        lifecycle: coreServices.lifecycle,
      },
      async init({ config, logger, events, lifecycle }) {
        const kafka = KafkaConsumerClient.fromConfig({
          config,
          events,
          logger,
        });

        if (!kafka) {
          return;
        }

        await kafka.start();

        lifecycle.addShutdownHook(async () => await kafka.shutdown());
      },
    });
  },
});
