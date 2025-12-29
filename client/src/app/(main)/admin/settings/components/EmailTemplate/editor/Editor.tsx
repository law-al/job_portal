import { EditorState, ParagraphNode, TextNode } from 'lexical';
import { HeadingNode } from '@lexical/rich-text';
import { useCallback, useEffect, useState } from 'react';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { theme } from './theme';
import './theme.css';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import Toolbar from './Toolbar';
import { LinkNode } from '@lexical/link';
import { useSystemSettings } from '../../../provider';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

function MyOnChangePlugin({ onChange }: { onChange: (editorState: EditorState) => void }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}

export default function Editor({ editEmailTemplate }: { editEmailTemplate: boolean }) {
  const [editorState, setEditorState] = useState<EditorState | null>(null);

  console.log(editEmailTemplate);
  const toolbarClassName = editEmailTemplate ? 'pointer-events-auto' : 'pointer-events-none opacity-50 select-none';
  const contentEditableClassName = editEmailTemplate ? 'cursor-text' : 'cursor-not-allowed pointer-events-none opacity-50 select-none';
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes: [ParagraphNode, HeadingNode, TextNode, LinkNode],
  };

  const onChange = useCallback((editorState: EditorState) => {
    setEditorState(editorState);
  }, []);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border border-gray-200 rounded-lg bg-white shadow-md flex flex-col h-[400px]">
        <div className={`shrink-0 border-b border-gray-200 p-3 bg-gray-50 ${toolbarClassName}`}>
          <Toolbar />
        </div>

        <div className="flex-1 overflow-hidden relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={`h-full w-full p-4 ${contentEditableClassName} overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset`}
                aria-placeholder="Enter some text..."
                placeholder={<div className="absolute top-4 left-4 text-gray-400 pointer-events-none select-none">Enter some text...</div>}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        <HistoryPlugin />
        <LinkPlugin />
        <AutoFocusPlugin />
        <MyOnChangePlugin onChange={onChange} />
      </div>
    </LexicalComposer>
  );
}
