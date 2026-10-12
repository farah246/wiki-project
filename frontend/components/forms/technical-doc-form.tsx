"use client"

import { useActionState } from "react"

import {
    createTechnicalDoc,
    updateTechnicalDoc,
    type TechnicalDocFormState,
} from "@/actions/technical-docs"
import {
    FormSection,
    FormShell,
    TextAreaField,
    TextField,
} from "@/components/forms/form-parts"
import type { TechnicalDoc } from "@/lib/types/technical-doc"

type TechnicalDocFormProps = {
    document?: TechnicalDoc
}

const initialState: TechnicalDocFormState = {
    error: "",
}

export function TechnicalDocForm({ document }: TechnicalDocFormProps) {
    const isEditing = Boolean(document)

    const action = document
        ? updateTechnicalDoc.bind(null, document.id)
        : createTechnicalDoc

    const [state, formAction, isPending] = useActionState(
        action,
        initialState
    )

    return (
        <FormShell
            action={formAction}
            error={state?.error}
            isPending={isPending}
            isEditing={isEditing}
            cancelHref={
                document
                    ? `/technical-docs/${document.id}`
                    : "/technical-docs"
            }
            createLabel="Create document"
        >
            <FormSection
                title="Basic information"
                description={
                    isEditing
                        ? "Update the title and content of your technical document."
                        : "Give your technical document a title and describe the knowledge it contains."
                }
            >
                <TextField
                    id="title"
                    label="Title"
                    defaultValue={document?.title}
                    placeholder="e.g. Spring Boot REST API"
                    required
                    disabled={isPending}
                />

                <TextAreaField
                    id="content"
                    label="Content"
                    defaultValue={document?.content}
                    placeholder="Write the technical documentation here..."
                    required
                    disabled={isPending}
                    rows={12}
                />
            </FormSection>

            <FormSection
                title="Technical details"
                description="Add optional code or Git information related to this document."
            >
                <TextAreaField
                    id="codeSnippet"
                    label="Code snippet"
                    defaultValue={document?.codeSnippet ?? ""}
                    placeholder="Paste a relevant code snippet..."
                    optional
                    disabled={isPending}
                    rows={10}
                    mono
                />

                <TextField
                    id="gitRef"
                    label="Git reference"
                    defaultValue={document?.gitRef ?? ""}
                    placeholder="e.g. feature/authentication"
                    optional
                    disabled={isPending}
                />
            </FormSection>
        </FormShell>
    )
}