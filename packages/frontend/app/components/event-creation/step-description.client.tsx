import { RichTextEditor } from '@mantine/rte'

interface Properties {
  description: string
  onSetDescription: (value: string) => void
}

/**
 * This component is available only client side
 */
export const StepDescriptionClient = ({
  description,
  onSetDescription,
}: Properties) => {
  return (
    <RichTextEditor
      value={description}
      onChange={onSetDescription}
      id="rte"
      controls={[
        ['bold', 'italic', 'underline', 'link'],
        ['unorderedList', 'h1', 'h2', 'h3'],
      ]}
    />
  )
}
