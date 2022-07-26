import React from 'react';

import DoneIcon from '@mui/icons-material/Done';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';

import PropTypes from 'prop-types';
import { getFormatState } from 'roosterjs-editor-api';

import { ButtonTitleEnum, hexAToRGBA, hexToRGB } from '../constants';

import styles from './styled';
function ColorsTable({ classes, editor, onDismiss, button }) {
  const theme = useTheme();
  const colorNames = [
    'gray',
    'red',
    'orange',
    'yellow',
    'lime',
    'green',
    'blue',
    'indigo',
    'violet',
  ];
  const colorIndex = [9, 7, 5, 3, 1];
  const format = getFormatState(editor);
  const onClick = (color) => {
    if (button.onClick) {
      button.onClick(editor, color);
    }
    onDismiss();
  };
  const checkColorSelected = (color) => {
    if (
      button.title === ButtonTitleEnum.TEXT_COLOR ||
      button.title === ButtonTitleEnum.HIGHLIGHT_COLOR
    ) {
      const field =
        button.title === ButtonTitleEnum.TEXT_COLOR
          ? 'textColor'
          : 'backgroundColor';
      return (
        format[field] === hexToRGB(color) || format[field] === hexAToRGBA(color)
      );
    }
    return false;
  };

  return (
    <Box display='flex'>
      {colorNames.map((a, index) => (
        <Box display='flex' flexDirection='column' key={index}>
          {colorIndex.map((i, indx) => {
            const isLastGrayColor = i === 1 && a === 'gray';
            const backgroundColor = !isLastGrayColor
              ? theme.openColors[a][i]
              : theme.openColors.white;
            const isSelected = checkColorSelected(backgroundColor);
            const style = {
              background: backgroundColor,
              border:
                isSelected || isLastGrayColor
                  ? `2px solid ${theme.openColors.gray[isSelected ? 9 : 4]}`
                  : 0,
              color: [
                theme.newColors.gray[900],
                theme.newColors.gray[700],
              ].includes(theme.openColors[a][i])
                ? theme.openColors.white
                : theme.openColors.black,
            };
            return (
              <Box
                key={indx}
                display='flex'
                alignContent='center'
                justifyContent='center'
                style={style}
                className={classes.colorTable}
                height={32}
                width={32}
                m={0.5}
                onClick={() => onClick(backgroundColor)}
              >
                {isSelected && (
                  <Box display='flex' alignItems='center'>
                    <DoneIcon />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
ColorsTable.propTypes = {
  classes: PropTypes.object,
  editor: PropTypes.object,
  onDismiss: PropTypes.func,
  button: PropTypes.object,
};
ColorsTable.defaultProps = {
  button: {},
};
const FormColorsTable = withStyles(styles)(ColorsTable);

export default function renderColorsTable(editor, onDismiss, button, ...rest) {
  return (
    <FormColorsTable
      editor={editor}
      onDismiss={onDismiss}
      button={button}
      {...rest}
    />
  );
}
