export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-lg border border-slate-100/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 p-4 ${className}`}>
      {children}
    </div>
  )
}
