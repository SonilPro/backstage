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

import clsx from 'clsx';
import {
  ComponentProps,
  forwardRef,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { useStyles } from '../../hooks/useStyles';
import styles from './Snackbar.module.css';

export interface SnackBarProps extends ComponentProps<'div'> {
  message: string;
  open?: boolean;
  anchorOrigin?: {
    vertical?: 'top' | 'bottom';
    horizontal?: 'left' | 'center' | 'right';
  };
  action?: ReactNode;
  className?: string;
}

export const SnackBar = forwardRef<HTMLDivElement, SnackBarProps>(
  (props, ref) => {
    const { classNames, cleanedProps } = useStyles('Snackbar', {
      anchorOrigin: { vertical: 'top', horizontal: 'center' },
      ...props,
    });

    const {
      open,
      anchorOrigin: { horizontal, vertical },
      message,
      action,
      style,
      className,
      ...rest
    } = cleanedProps;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      if (open) {
        requestAnimationFrame(() => setVisible(true));
      } else {
        setVisible(false);
      }
    }, [open]);

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={clsx(
          classNames.root,
          styles[classNames.root],
          { [styles.open]: visible },
          className,
        )}
        data-vertical={vertical}
        data-horizontal={horizontal}
        style={{ ...style }}
        {...rest}
      >
        <div
          className={clsx(
            classNames.message,
            styles[classNames.message],
            className,
          )}
        >
          {message}
        </div>
        {action && (
          <div
            className={clsx(
              classNames.action,
              styles[classNames.action],
              className,
            )}
          >
            {action}
          </div>
        )}
      </div>
    );
  },
);
