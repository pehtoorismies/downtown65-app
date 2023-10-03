import { RichTextEditor } from '@mantine/tiptap'
import { Underline } from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import type { ReducerProps } from './reducer'

/**
 * This component is available only client side
 */
// TODO; update editor
export const StepDescriptionClient = ({ state, dispatch }: ReducerProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: state.description,
  })

  return (
    <RichTextEditor
      editor={editor}
      // onChange={(description) => {
      //   dispatch({
      //     kind: 'description',
      //     description,
      //   })
      // }}
      id="rte"
      // controls={[
      //   ['bold', 'italic', 'underline', 'link'],
      //   ['unorderedList', 'h1', 'h2', 'h3'],
      // ]}
    >
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>
    </RichTextEditor>
  )
}
