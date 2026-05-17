import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-primary text-on-primary hover:bg-primary-deep',
  secondary: 'bg-canvas text-ink border border-hairline-strong hover:border-ink',
  dark: 'bg-canvas-night text-on-dark hover:bg-canvas-night-soft',
  outline: 'bg-transparent text-primary border border-primary hover:bg-primary hover:text-on-primary',
  ghost: 'bg-transparent text-ink hover:bg-canvas-soft',
}

const sizes = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Component,
  href,
  className = '',
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 cursor-pointer select-none'
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  if (Component) {
    return (
      <Component className={classes} {...props}>
        {children}
      </Component>
    )
  }

  const Tag = href ? motion.a : motion.button

  return (
    <Tag
      href={href}
      className={classes}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </Tag>
  )
}
