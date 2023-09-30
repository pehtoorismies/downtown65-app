import { RichTextEditor } from '@mantine/rte'
import type { ReducerProps } from './reducer'

/**
 * This component is available only client side
 */
export const StepDescriptionClient = ({ state, dispatch }: ReducerProps) => {
  return (
    <RichTextEditor
      value={state.description}
      onChange={(description) => {
        dispatch({
          kind: 'description',
          description,
        })
      }}
      id="rte"
      controls={[
        ['bold', 'italic', 'underline', 'link'],
        ['unorderedList', 'h1', 'h2', 'h3'],
      ]}
    />
  )
}
