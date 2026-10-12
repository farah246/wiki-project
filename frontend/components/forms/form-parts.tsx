"use client"

import Link from "next/link"
import type { ReactNode } from "react"

const inputBase =
    "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"

// Wraps a whole document form: error banner, the sections, and the
// Cancel / Submit buttons. The form action stays in each concrete form.
type FormShellProps = {
    action: (formData: FormData) => void
    error?: string
    isPending: boolean
    isEditing: boolean
    cancelHref: string
    createLabel: string
    children: ReactNode
}

export function FormShell({
                              action,
                              error,
                              isPending,
                              isEditing,
                              cancelHref,
                              createLabel,
                              children,
                          }: FormShellProps) {
    return (
        <form action={action} className="space-y-8">
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                    {error}
                </div>
            )}

            {children}

            <div className="flex items-center justify-end gap-3">
                <Link
                    href={cancelHref}
                    className="rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isPending
                        ? isEditing
                            ? "Saving..."
                            : "Creating..."
                        : isEditing
                            ? "Save changes"
                            : createLabel}
                </button>
            </div>
        </form>
    )
}

type FormSectionProps = {
    title: string
    description: string
    children: ReactNode
}

export function FormSection({
                                title,
                                description,
                                children,
                            }: FormSectionProps) {
    return (
        <section className="rounded-2xl border bg-card">
            <div className="border-b px-6 py-4">
                <h2 className="font-semibold">{title}</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                </p>
            </div>

            <div className="space-y-6 px-6 py-6">{children}</div>
        </section>
    )
}

type FieldProps = {
    id: string
    label: string
    defaultValue?: string
    placeholder?: string
    required?: boolean
    optional?: boolean
    disabled?: boolean
}

function FieldLabel({
                        id,
                        label,
                        optional,
                    }: Pick<FieldProps, "id" | "label" | "optional">) {
    return (
        <label htmlFor={id} className="text-sm font-medium">
            {label}

            {optional && (
                <span className="ml-2 font-normal text-muted-foreground">
                    Optional
                </span>
            )}
        </label>
    )
}

export function TextField({
                              id,
                              label,
                              defaultValue = "",
                              placeholder,
                              required,
                              optional,
                              disabled,
                          }: FieldProps) {
    return (
        <div className="space-y-2">
            <FieldLabel id={id} label={label} optional={optional} />

            <input
                id={id}
                name={id}
                type="text"
                defaultValue={defaultValue}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={inputBase}
            />
        </div>
    )
}

type TextAreaFieldProps = FieldProps & {
    rows: number
    mono?: boolean
}

export function TextAreaField({
                                  id,
                                  label,
                                  defaultValue = "",
                                  placeholder,
                                  required,
                                  optional,
                                  disabled,
                                  rows,
                                  mono,
                              }: TextAreaFieldProps) {
    return (
        <div className="space-y-2">
            <FieldLabel id={id} label={label} optional={optional} />

            <textarea
                id={id}
                name={id}
                defaultValue={defaultValue}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                rows={rows}
                className={`${inputBase} resize-y leading-6 ${
                    mono ? "font-mono placeholder:font-sans" : ""
                }`}
            />
        </div>
    )
}