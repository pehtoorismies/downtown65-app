import { Box } from '@mantine/core'
import { Link, RichTextEditor } from '@mantine/tiptap'
import { Underline } from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import type { ReducerProps } from './reducer'

/**
 * This component is available only client side
 */
export const StepDescriptionClient = ({ state, dispatch }: ReducerProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Link, Underline],
    content: state.description,
    autofocus: true,
    editable: true,
    onUpdate: ({ editor }) => {
      dispatch({
        kind: 'description',
        value: editor.getHTML(),
      })
    },
  })

  return (
    <Box style={{ minHeight: '300px' }}>
      <RichTextEditor editor={editor} id="rte">
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
        <RichTextEditor.Content />
      </RichTextEditor>
    </Box>
  )
}
