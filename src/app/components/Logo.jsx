import {h} from 'hyperapp'

export default function Logo({
  size = 32,
  variant='regular',
  ...props
} = {}) {
  const src = variant === 'small'
    ? '/assets/logo-small.svg'
    : '/assets/logo.svg'

  return (
    <img
      {...props}
      src={src}
      width={size}
      height={size}
      alt="Logo"
    />
  )
}
