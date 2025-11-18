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

import { forwardRef, useEffect, useState } from 'react';
import { useStyles } from '../../hooks/useStyles';
import styles from './Snackbar.module.css';
import clsx from 'clsx';

export interface SnackBarProps {
  message: string;
  open?: boolean;
  anchorOrigin?: {
    vertical?: 'top' | 'bottom';
    horizontal?: 'left' | 'center' | 'right';
  };
  className?: string;
}

export const SnackBar = forwardRef<HTMLDivElement, SnackBarProps>(
  (props, ref) => {
    const {
      message,
      open,
      anchorOrigin = { vertical: 'top', horizontal: 'center' },
      className,
    } = props;
    const { vertical, horizontal } = anchorOrigin;
    const { classNames, cleanedProps } = useStyles('Snackbar', props);
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
          classNames.snackbar,
          styles[classNames.snackbar],
          { [styles.open]: visible },
          className,
        )}
        data-vertical={vertical}
        data-horizontal={horizontal}
        {...cleanedProps}
      >
        {message}
      </div>
    );
  },
);
