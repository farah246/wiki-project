"use client"

import { useActionState } from "react"

import {
    createCommercialDoc,
    updateCommercialDoc,
    type CommercialDocFormState,
} from "@/actions/commercial-doc"
import {
    FormSection,
    FormShell,
    TextAreaField,
    TextField,
} from "@/components/forms/form-parts"
import type { CommercialDoc } from "@/lib/types/commercial-doc"

type CommercialDocFormProps = {
    document?: CommercialDoc
}

const initialState: CommercialDocFormState = {
    error: "",
}

export function CommercialDocForm({ document }: CommercialDocFormProps) {
    const isEditing = Boolean(document)

    const action = document
        ? updateCommercialDoc.bind(null, document.id)
        : createCommercialDoc

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
                    ? `/commercial-docs/${document.id}`
                    : "/commercial-docs"
            }
            createLabel="Create document"
        >
            <FormSection
                title="Basic information"
                description={
                    isEditing
                        ? "Update the basic information of your commercial document."
                        : "Give your commercial document a title and identify the client."
                }
            >
                <TextField
                    id="title"
                    label="Title"
                    defaultValue={document?.title}
                    placeholder="e.g. Enterprise Cloud Proposal"
                    required
                    disabled={isPending}
                />

                <TextField
                    id="clientName"
                    label="Client name"
                    defaultValue={document?.clientName}
                    placeholder="e.g. Acme Corporation"
                    required
                    disabled={isPending}
                />
            </FormSection>

            <FormSection
                title="Proposal"
                description="Write the commercial proposal and information related to the client."
            >
                <TextAreaField
                    id="proposalText"
                    label="Proposal text"
                    defaultValue={document?.proposalText}
                    placeholder="Write the commercial proposal here..."
                    required
                    disabled={isPending}
                    rows={14}
                />
            </FormSection>
        </FormShell>
    )
}