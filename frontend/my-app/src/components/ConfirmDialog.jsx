export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative bg-surface border border-border rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl">
        <h2 className="text-base font-medium text-text mb-2">{title}</h2>
        {message && <p className="text-sm text-text-muted mb-6">{message}</p>}

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-text-muted hover:text-text px-4 py-2 transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`text-sm font-medium rounded px-4 py-2 transition ${
              danger
                ? "bg-error text-white hover:opacity-90"
                : "bg-accent hover:bg-accent-hover text-text"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
