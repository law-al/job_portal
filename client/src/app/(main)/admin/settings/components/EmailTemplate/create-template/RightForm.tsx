import React from 'react';
import Editor from '../editor/Editor';

export default function RightForm({ handleEditorState, errors }: { handleEditorState: (editorState: string) => void; errors?: Record<string, string[]> }) {
  return (
    <div className="bg-gray-100 col-span-9 h-full overflow-y-auto">
      <div className="rounded-lg h-full flex flex-col">
        {/* Email Body Header */}
        <div className="border-b bg-white border border-gray-200 p-4 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-gray-900">Email Body</h3>
          <div className="flex items-center gap-2">
            <button type="button" className="px-3 py-1.5 text-sm font-medium rounded bg-blue-500 text-white hover:bg-blue-600">
              Editor
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <Editor editEmailTemplate={true} handleEditorState={handleEditorState} />
          {errors?.editorState && <p className="text-red-500 text-xs mt-2 px-4 pb-2">{errors.editorState[0]}</p>}
          {errors?.content && <p className="text-red-500 text-xs mt-2 px-4 pb-2">{errors.content[0]}</p>}
        </div>
      </div>
    </div>
  );
}
