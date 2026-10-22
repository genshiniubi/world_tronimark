import { useMemo, useState } from 'react';
import type { FileMap, Language } from '@codelab/shared';
import { Icon } from '../../components/Icon';

interface FileTreeProps {
  files: FileMap;
  activeFile: string;
  entryFile: string;
  language: Language;
  onSelect: (path: string) => void;
  onCreate: (path: string) => void;
  onDelete: (path: string) => void;
}

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children: TreeNode[];
}

function buildTree(files: FileMap): TreeNode[] {
  const root: TreeNode = { name: '', path: '', type: 'folder', children: [] };
  for (const file of Object.keys(files)) {
    const parts = file.split('/');
    let cursor = root;
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const path = parts.slice(0, index + 1).join('/');
      let node = cursor.children.find((child) => child.name === part);
      if (!node) {
        node = { name: part, path, type: isFile ? 'file' : 'folder', children: [] };
        cursor.children.push(node);
      }
      cursor = node;
    });
  }
  const sort = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((node) => sort(node.children));
  };
  sort(root.children);
  return root.children;
}

export function FileTree({
  files,
  activeFile,
  entryFile,
  language,
  onSelect,
  onCreate,
  onDelete,
}: FileTreeProps) {
  const tree = useMemo(() => buildTree(files), [files]);
  const [adding, setAdding] = useState(false);
  const [newPath, setNewPath] = useState('');

  const submitNew = () => {
    const path = newPath.trim().replace(/\\/g, '/');
    if (!path) {
      setAdding(false);
      return;
    }
    onCreate(path);
    setNewPath('');
    setAdding(false);
  };

  return (
    <div className="file-tree">
      <div className="file-tree-head">
        <span>文件</span>
        <div className="file-tree-actions">
          <button
            type="button"
            className="icon-btn small"
            onClick={() => setAdding((value) => !value)}
            title="新建文件"
            aria-label="新建文件"
          >
            <Icon name="plus" size={14} />
          </button>
          <button
            type="button"
            className="icon-btn small"
            onClick={() => {
              if (activeFile !== entryFile) onDelete(activeFile);
            }}
            disabled={activeFile === entryFile}
            title={activeFile === entryFile ? '入口文件不能删除' : '删除当前文件'}
            aria-label="删除当前文件"
          >
            <Icon name="trash" size={14} />
          </button>
        </div>
      </div>
      {adding ? (
        <div className="new-file-row">
          <Icon name="file" size={14} />
          <input
            autoFocus
            value={newPath}
            onChange={(event) => setNewPath(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitNew();
              if (event.key === 'Escape') setAdding(false);
            }}
            placeholder={`src/helper.${language === 'cpp' ? 'hpp' : 'py'}`}
            aria-label="新文件路径"
          />
          <button type="button" className="text-btn" onClick={submitNew}>
            创建
          </button>
        </div>
      ) : null}
      <div className="tree-scroll">
        {tree.map((node) => (
          <TreeBranch
            key={node.path}
            node={node}
            depth={0}
            activeFile={activeFile}
            entryFile={entryFile}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function TreeBranch({
  node,
  depth,
  activeFile,
  entryFile,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  activeFile: string;
  entryFile: string;
  onSelect: (path: string) => void;
}) {
  const [open, setOpen] = useState(true);
  if (node.type === 'folder') {
    return (
      <div className="tree-folder">
        <button
          type="button"
          className="tree-row"
          style={{ paddingLeft: `${8 + depth * 14}px` }}
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? 'chevronDown' : 'chevron'} size={13} />
          <Icon name="folder" size={14} />
          <span>{node.name}</span>
        </button>
        {open ? (
          <div>
            {node.children.map((child) => (
              <TreeBranch
                key={child.path}
                node={child}
                depth={depth + 1}
                activeFile={activeFile}
                entryFile={entryFile}
                onSelect={onSelect}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }
  const isEntry = node.path === entryFile;
  return (
    <button
      type="button"
      className={`tree-row tree-file ${activeFile === node.path ? 'is-active' : ''}`}
      style={{ paddingLeft: `${22 + depth * 14}px` }}
      onClick={() => onSelect(node.path)}
      title={node.path}
    >
      <Icon name="file" size={14} />
      <span>{node.name}</span>
      {isEntry ? <span className="entry-badge">入口</span> : null}
    </button>
  );
}
