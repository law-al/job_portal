import { EditorState, ParagraphNode, TextNode } from 'lexical';
import { HeadingNode } from '@lexical/rich-text';
import { useCallback, useEffect, useRef, useState } from 'react';
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

// Plugin to load content from database
function LoadContentPlugin({ content }: { content: string }) {
  const [editor] = useLexicalComposerContext();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!content || hasLoadedRef.current) return;

    try {
      const editorState = editor.parseEditorState(content);
      editor.setEditorState(editorState);
      hasLoadedRef.current = true;
    } catch (error) {
      console.error('Failed to parse editor state:', error);
    }
  }, [content, editor]);

  return null;
}
// Plugin to control editability
function EditablePlugin({ editable }: { editable: boolean }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(editable);
  }, [editor, editable]);

  return null;
}

export default function Editor({
  editEmailTemplate,
  handleEditorState,
  editorState,
  initialContent,
}: {
  editEmailTemplate: boolean;
  handleEditorState?: (editorState: string) => void;
  editorState?: string;
  initialContent?: string;
}) {
  console.log('editEmailTemplate:', editEmailTemplate);
  console.log('initialContent:', initialContent);

  const toolbarClassName = editEmailTemplate ? 'pointer-events-auto' : 'pointer-events-none opacity-50 select-none';
  const contentEditableClassName = editEmailTemplate ? 'cursor-text' : 'cursor-not-allowed select-none';

  const initialConfig = {
    namespace: 'MyEditor',
    editorState: editorState || initialContent || undefined,
    theme,
    onError,
    editable: editEmailTemplate, // Control editability from the start
    nodes: [ParagraphNode, HeadingNode, TextNode, LinkNode],
  };

  const onChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const json = editorState.toJSON();
        console.log('json', json);
        if (handleEditorState) {
          handleEditorState(JSON.stringify(json));
        }
      });
    },
    [handleEditorState],
  );

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
        {editEmailTemplate && <AutoFocusPlugin />}
        {handleEditorState && <MyOnChangePlugin onChange={onChange} />}
        {/* Load content dynamically if initialContent is provided and different from editorState */}
        {initialContent && !editorState && <LoadContentPlugin content={initialContent} />}
        {/* Control editability dynamically */}
        <EditablePlugin editable={editEmailTemplate} />
      </div>
    </LexicalComposer>
  );
}
