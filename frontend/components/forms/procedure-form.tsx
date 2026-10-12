"use client"

import { useActionState } from "react"

import {
    createProcedure,
    updateProcedure,
    type ProcedureFormState,
} from "@/actions/procedures"
import {
    FormSection,
    FormShell,
    TextAreaField,
    TextField,
} from "@/components/forms/form-parts"
import type { Procedure } from "@/lib/types/procedure"

type ProcedureFormProps = {
    procedure?: Procedure
}

const initialState: ProcedureFormState = {
    error: "",
}

export function ProcedureForm({ procedure }: ProcedureFormProps) {
    const isEditing = Boolean(procedure)

    const action = procedure
        ? updateProcedure.bind(null, procedure.id)
        : createProcedure

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
                procedure ? `/procedures/${procedure.id}` : "/procedures"
            }
            createLabel="Create procedure"
        >
            <FormSection
                title="Basic information"
                description={
                    isEditing
                        ? "Update the basic information of your procedure."
                        : "Give your procedure a clear title and description."
                }
            >
                <TextField
                    id="title"
                    label="Title"
                    defaultValue={procedure?.title}
                    placeholder="e.g. Deploy a Spring Boot service"
                    required
                    disabled={isPending}
                />

                <TextAreaField
                    id="description"
                    label="Description"
                    defaultValue={procedure?.description}
                    placeholder="Describe the procedure and its steps..."
                    required
                    disabled={isPending}
                    rows={12}
                />
            </FormSection>

            <FormSection
                title="Visual model"
                description="Add a visual representation, diagram, or model of the procedure."
            >
                <TextAreaField
                    id="visualModel"
                    label="Visual model"
                    defaultValue={procedure?.visualModel ?? ""}
                    placeholder="Add a diagram, Mermaid model, or visual description..."
                    disabled={isPending}
                    rows={10}
                    mono
                />
            </FormSection>
        </FormShell>
    )
}