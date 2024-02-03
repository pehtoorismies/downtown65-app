import { Box } from '@mantine/core'
import { Link, RichTextEditor } from '@mantine/tiptap'
import { Underline } from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import type { ChallengeReducerProps } from '~/routes-common/challenges/create-edit/challenge-reducer'

/**
 * This component is available only client side
 */
export const ChallengeDescription = ({
  state,
  dispatch,
}: ChallengeReducerProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Link, Underline],
    content: state.description,
    autofocus: true,
    editable: true,
    onUpdate: ({ editor }) => {
      const value = editor.getHTML()
      dispatch({
        kind: 'description',
        value,
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
