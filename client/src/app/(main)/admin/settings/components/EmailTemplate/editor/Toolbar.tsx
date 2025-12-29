import { Button } from '@/components/ui/button';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $createParagraphNode, $getSelection, $isParagraphNode, $isRangeSelection, UNDO_COMMAND } from 'lexical';
import { Heading1Icon, Link2Icon } from 'lucide-react';
import { Heading2Icon } from 'lucide-react';
import { Heading3Icon } from 'lucide-react';
import { Heading4Icon } from 'lucide-react';
import { Heading5Icon } from 'lucide-react';
import { BoldIcon } from 'lucide-react';
import { ItalicIcon } from 'lucide-react';
import { UnderlineIcon } from 'lucide-react';
import { Pilcrow } from 'lucide-react';
import { RedoIcon } from 'lucide-react';
import { UndoIcon } from 'lucide-react';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { REDO_COMMAND } from 'lexical';
import { useState } from 'react';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type BlockType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'paragraph';
type Format = 'bold' | 'italic' | 'underline';

const headings: { heading: BlockType; icon: React.ElementType; label: string }[] = [
  {
    heading: 'paragraph',
    icon: Pilcrow,
    label: 'Paragraph',
  },
  {
    heading: 'h1',
    icon: Heading1Icon,
    label: 'Heading 1',
  },
  {
    heading: 'h2',
    icon: Heading2Icon,
    label: 'Heading 2',
  },
  {
    heading: 'h3',
    icon: Heading3Icon,
    label: 'Heading 3',
  },
  {
    heading: 'h4',
    icon: Heading4Icon,
    label: 'Heading 4',
  },
  {
    heading: 'h5',
    icon: Heading5Icon,
    label: 'Heading 5',
  },
];

const history = [
  {
    action: 'redo',
    icon: RedoIcon,
  },
  {
    action: 'undo',
    icon: UndoIcon,
  },
];

function HeaderPlugin() {
  const [editor] = useLexicalComposerContext();
  const [currentHeading, setCurrentHeading] = useState<BlockType>('paragraph');

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();

          if ($isHeadingNode(element)) {
            setCurrentHeading(element.getTag() as BlockType);
          } else if ($isParagraphNode(element)) {
            setCurrentHeading('paragraph');
          } else {
            setCurrentHeading('paragraph');
          }
        }
      });
    });
  }, [editor]);

  const onClick = (blockType: BlockType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (blockType === 'paragraph') {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(blockType));
        }
      }
    });
  };

  return (
    <Select value={currentHeading} onValueChange={(value) => onClick(value as BlockType)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Paragraph" />
      </SelectTrigger>
      <SelectContent>
        {headings.map(({ heading, icon, label }) => {
          const Icon = icon;
          return (
            <SelectItem key={heading} value={heading}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

function FormatPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat('bold'));
          setIsItalic(selection.hasFormat('italic'));
          setIsUnderline(selection.hasFormat('underline'));
        }
      });
    });
  }, [editor]);
  const onClick = (format: Format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };
  return (
    <div className="flex items-center gap-1">
      <Button type="button" variant="outline" onClick={() => onClick('bold')} className={`hover:bg-black hover:text-white ${isBold ? 'bg-black text-white' : ''}`}>
        <BoldIcon className="w-4 h-4" />
      </Button>
      <Button type="button" variant="outline" onClick={() => onClick('italic')} className={`hover:bg-black hover:text-white ${isItalic ? 'bg-black text-white' : ''}`}>
        <ItalicIcon className="w-4 h-4" />
      </Button>
      <Button type="button" variant="outline" onClick={() => onClick('underline')} className={`hover:bg-black hover:text-white ${isUnderline ? 'bg-black text-white' : ''}`}>
        <UnderlineIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}

function HistoryPlugin() {
  const [editor] = useLexicalComposerContext();
  const onClick = (action: 'redo' | 'undo') => {
    if (action === 'redo') {
      editor.dispatchCommand(REDO_COMMAND, undefined);
    } else {
      editor.dispatchCommand(UNDO_COMMAND, undefined);
    }
  };
  return (
    <div className="flex items-center gap-2">
      {history.map(({ action, icon }) => {
        const Icon = icon;
        return (
          <Button type="button" variant="outline" key={action} onClick={() => onClick(action as 'redo' | 'undo')}>
            <Icon className="w-4 h-4" />
          </Button>
        );
      })}
    </div>
  );
}

function LinkPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isLink, setIsLink] = useState<boolean>(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode();
          const parent = node.getParent();
          setIsLink($isLinkNode(node) || $isLinkNode(parent));
        }
      });
    });
  }, [editor]);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const url = prompt('Enter URL:');
    if (!url) return;
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  };

  return (
    <Button type="button" variant="outline" onClick={onClick} className={`hover:bg-black hover:text-white ${isLink ? 'bg-black text-white' : ''}`}>
      <Link2Icon className="w-4 h-4" />
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <HistoryPlugin />
      <div className="h-6 w-px bg-gray-300" /> {/* Divider */}
      <HeaderPlugin />
      <div className="h-6 w-px bg-gray-300" /> {/* Divider */}
      <FormatPlugin />
      <div className="h-6 w-px bg-gray-300" /> {/* Divider */}
      <LinkPlugin />
    </div>
  );
}
