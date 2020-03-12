import {h} from 'hyperapp'

export default function Logo({size = 32, ...props} = {}) {
  return (
    <img
      {...props}
      src="/assets/logo.png"
      width={size}
      height={size}
      alt="Logo"
    />
  )
}
