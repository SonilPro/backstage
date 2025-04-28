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

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  newRibbon: {
    position: 'absolute',
    top: 0,
    right: 0,
    textAlign: 'center',
    transform: 'translateY(-100%) translateX(35%) rotate(45deg)',
    backgroundColor: theme.palette.navigation.indicator,
    color: 'black',
    transformOrigin: 'bottom left',
    padding: '0 0.9lh',
  },
}));

export const NewRibbon = () => {
  const classes = useStyles();

  return <div className={classes.newRibbon}>NEW</div>;
};
