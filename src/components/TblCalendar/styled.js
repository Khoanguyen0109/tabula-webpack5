// import resize from 'assets/images/resizeTimeblock_indicator.svg';
import extraIcn from 'assets/images/icn_extra_curricular.svg';
const styles = (theme) => {
  const fontSizeTitle = theme.fontSize.xSmall;
  const blockStyles = {
    borderRadius: theme.spacing(1),
    borderWidth: 1,
    padding: theme.spacing(0, 0.5),
  };
  return {
    root: {
      '& .tui-full-calendar-week-container': {
        minHeight: 0
      },
      '& .tui-full-calendar-timegrid-container': {
        scrollBehavior: 'smooth',
        paddingTop: theme.spacing(2),
        scrollbarColor: `${theme.mainColors.gray[6]} white`,
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar-track': {
          borderRadius: 10,
          backgroundColor: 'white',
        },

        '&::-webkit-scrollbar': {
          width: 6,
          height: 6,
          backgroundColor: 'white',
        },

        '&::-webkit-scrollbar-thumb': {
          border: 'none',
          borderRadius: 10,
          backgroundColor: theme.mainColors.gray[6],
        },
        '& .tui-full-calendar-timegrid-h-grid': {
          position: 'relative',
          zIndex: 1,
        },
        '& .tui-full-calendar-timegrid-study-hall': {
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '100%',
          background: 'transparent',
          zIndex: 0,
          '& .study-hall-item': {
            position: 'absolute',
            background: '#e6f7ff'
          }
        },
        '& .tui-full-calendar-timegrid-schedules': {
          borderTop: '1px solid rgb(236, 237, 240)',
          borderBottom: '1px solid rgb(236, 237, 240)',
          zIndex: 2,
          cursor: 'default',
        },
        '& .tui-full-calendar-timegrid-hourmarker': {
          zIndex: 2
        },
        '& .tui-full-calendar-timegrid-gridline-quarter': {
          // borderBottom: '1px solid rgb(236, 237, 240) !important'
        }
      },
      '& .tui-full-calendar-timegrid-hour': {
        '& span': {
          display: 'block !important',
        }
      },
      '& .tui-full-calendar-dayname-layout': {
        '& .calendar-week-dayname-name': {
          position: 'relative',
          fontSize: theme.fontSize.small,
          lineHeight: '19px !important',
          '& .day-name': {
            paddingTop: '10%',
            fontSize: theme.fontSize.normal,
            fontWeight: theme.fontWeight.semi,
            width: '100%',
            display: 'block',
          },
          '& .date': {
            fontWeight: theme.fontWeight.normal,
            display: 'block',
          }
        }
      },
      '& .tui-full-calendar-vlayout-container': {
        height: '100% !important',
        '& > div[class^="tui-view"]': {
          height: '100% !important'
        }
      },
      '& .tui-full-calendar-dayname-container': {
        overflowY: 'hidden'
      },

      '& .tui-full-calendar-time-schedule': {
        backgroundColor: 'unset !important',
        top: 0,
        left: 1,
        height: '100%',
        '& .tui-full-calendar-time-schedule-content': {
          position: 'relative',
          padding: 0,
          '&:hover': {
            opacity: '1 !important'
          },
          '& .time-template': {
            ...blockStyles,
            height: 'calc(100% - 4px)',
            borderStyle: 'solid',
            color: 'white',
            background: 'white',
            '&:hover': {
              cursor: 'pointer',
            },
            '&.block-disabled:hover': {
              cursor: 'default'
            },
            '& .title-wrapper': {
              display: 'flex',
              fontSize: fontSizeTitle,
              height: '100%',
              overflow: 'hidden',
              lineHeight: 'normal',
              fontWeight: theme.fontWeight.semi,
              '& .title-activity': {
                width: '100%'
              },
              '& .title-icon-wrapper': {
                paddingTop: theme.spacing(0.25),
                paddingRight: theme.spacing(0.25)
              },
              '& .title-icon': {
                width: 12,
                height: 12,
                maskSize: 'cover',
                maskRepeat: 'no-repeat',
                backgroundColor: theme.customColors.primary1.main,
                '&.extra-icon': {
                  maskImage: `url(${extraIcn})`,
                }
              },
              '& .skipped-title': {
                textDecorationLine: 'line-through' 
              }
            },
            '& .time-value': {
              fontWeight: theme.fontWeight.normal
            },
            '&.task-wrapper': {
              borderStyle: 'none',
              overflow: 'hidden'
            },
            '&.extra-curricular-tmp-wrapper': {
              background: theme.customColors.primary1.light[3],
              height: `calc(100% - ${theme.spacing(0.5)})`,
              color: theme.customColors.primary1.main,
              borderStyle: 'dashed',
              borderColor: theme.customColors.primary1.main,
            },
          },
          '& .study-hall-wrapper': {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            background: theme.openColors.blue[0]
          },
          '& .due-time-wrapper': {
            width: 'calc(100% - 5px)',
            padding: theme.spacing(0.5),
            borderRadius: theme.spacing(0.5),
            background: theme.newColors.gray[900],
            marginTop: theme.spacing(0.25),
            textAlign: 'center',
            '& span': {
              fontSize: fontSizeTitle,
              fontWeight: 'normal',
              fontStretch: 'normal',
              fontStyle: 'normal',
              lineHeight: 1.46,
              letterSpacing: 'normal',
              textAlign: 'center'
            }
          },
        },
      },
      '& .block-temp': {
        ...blockStyles,
        borderStyle: 'dashed',
        marginLeft: -5,
        height: 'calc(100% + 2px)',
        overflow: 'hidden',
        fontWeight: theme.fontWeight.semi,
        fontSize: fontSizeTitle,
        marginTop: -2,
        paddingTop: 0,
        background: 'white',
        padding: 0,
        '& .block-title': {
          marginLeft: 4,
        },
        // NOTE: Don't show  time
        // '& .time-value': {
        //   fontWeight: theme.fontWeight.normal
        // },
      },
      // TODO: Old CSS
      '& .creation-wrapper': {
        ...blockStyles,
        color: '#67cedb',
        fontSize: fontSizeTitle,
        height: '100%',
        backgroundColor: 'white',
        border: '1px dashed #6dbde6',
        overflow: 'hidden',
        '& .creation-due-time': {
          marginLeft: '25px'
        }
      },
      // END: Old CSS
      '&.weekly-calendar': {
        '& .tui-full-calendar-vlayout-container': {
          height: 'calc(100% - 80px) !important'
        }
      },
      '& .tui-full-calendar-time-date-schedule-block-wrap': {
        marginLeft: 0,
        marginRight: '0px !important',
      },
      '& .tui-full-calendar-time-date-schedule-block-cover': {
        cursor: 'move'
      },
      '& .tui-full-calendar-time-date-schedule-block-disable': {
        width: 'calc(100%)',
        cursor: 'default',
        '& .due-date': {
          display: 'flex',
          padding: '2px',
          '& .due-date-title': {
            backgroundColor: 'rgba(47, 47, 47)',
            width: '100%',
            padding: '4px 23px',
            margin: 0,
            height: 'auto',
            borderRadius: '4px',
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.46,
            fontSize: fontSizeTitle,
            fontWeight: 'normal'
          }
        }
      },
      '& .tui-full-calendar-time-date-schedule-block': {
        right: 8,
        '& .handle-x': {
          width: theme.spacing(1.5),
          height: 10,
          margin: '0 auto 0 auto !important',
          // background: `url(${resize})`,
          background: 'none;',
          color: 'transparent',
        }
        ,
        '& .tui-full-calendar-time-bottom-resize-handle': {
          bottom: 0,
        },
        '& .tui-full-calendar-time-top-resize-handle': {
          transform: 'scaleY(-1)',
          top: 0
        }
      }
    }
  };
};

export default styles;