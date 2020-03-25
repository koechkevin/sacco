import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import React, { CSSProperties, FC } from 'react';

import styles from './Icon.module.scss';

interface Props extends FontAwesomeIconProps {
  id?: string;
  hover?: boolean;
  style?: CSSProperties;
  className?: string;
  onClick?: (e: any) => void;
}

const Icon: FC<Props> = (props) => {
  const { id, style, hover, className, onClick, ...restProps } = props;
  const cls = [styles.icon, hover ? styles.hover : '', className || ''].join(' ');

  return (
    <span onClick={(e) => onClick && onClick(e)} id={id} style={style} className={cls}>
      <FontAwesomeIcon {...restProps} />
    </span>
  );
};

export default Icon;
