import React, { FC } from 'react'

import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  onClick?: () => void
  size?: 'full' | 'large' | 'medium' | 'small' | 'fit'
  kind?: 'text' | 'contained'
}

export const Button: FC<ButtonProps> = (props) => {
  const { children, onClick, ...rest } = props

  return (
    <button
      onClick={onClick}
      {...rest}
      className={`${styles.button} ${
        styles['button-' + (props.size ?? 'medium')]
      } ${styles['button-' + (props.kind ?? 'contained')]}`}
    >
      {children}
    </button>
  )
}
