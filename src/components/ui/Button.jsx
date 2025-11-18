export default function Button({ children, onClick, variant = 'default', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none';
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200',
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500',
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant] ?? variants.default} ${className}`} {...props}>
      {children}
    </button>
  )
}
