interface OptionButtonProps {
  label: string
  onClick: () => void
  icon?: string
}

export function OptionButton({ label, onClick, icon }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl bg-white px-6 py-5 text-left text-lg font-semibold text-[#1A1A1A] shadow-md transition active:scale-[0.98] hover:shadow-lg"
    >
      <span className="flex items-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        {label}
      </span>
    </button>
  )
}
