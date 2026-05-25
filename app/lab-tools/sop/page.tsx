'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { FolderPlus, Upload, Folder, FileText, ChevronLeft, Pencil, Trash2 } from 'lucide-react';
import ColorPicker, { COLOR_PALETTE } from '@/components/lab-tools/ColorPicker';
import { localDb as db } from '@/lib/localDb';

interface FolderRecord {
  id: string;
  folder_name: string;
  color_code?: string;
  created_date: string;
  [key: string]: unknown;
}

interface FileRecord {
  id: string;
  file_name: string;
  pdf_url?: string;
  folder_id?: string | null;
  color_code?: string;
  created_date: string;
  [key: string]: unknown;
}

export default function SOPFileSystem() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [openFolder, setOpenFolder] = useState<FolderRecord | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [draggingFile, setDraggingFile] = useState<FileRecord | null>(null);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState(COLOR_PALETTE[0]);
  const [editingFolder, setEditingFolder] = useState<FolderRecord | null>(null);
  const [editingFile, setEditingFile] = useState<FileRecord | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: folders = [] } = useQuery({
    queryKey: ['sop_folders'],
    queryFn: () => db.entities.SOP_Folder.list() as Promise<FolderRecord[]>,
  });

  const { data: files = [] } = useQuery({
    queryKey: ['sop_files'],
    queryFn: () => db.entities.SOP_File.list() as Promise<FileRecord[]>,
  });

  const createFolder = useMutation({
    mutationFn: (data: Record<string, unknown>) => db.entities.SOP_Folder.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sop_folders'] });
      setShowNewFolder(false);
      setNewFolderName('');
    },
  });

  const updateFolder = useMutation({
    mutationFn: ({ id, ...data }: FolderRecord) => db.entities.SOP_Folder.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['sop_folders'] }); setEditingFolder(null); },
  });

  const deleteFolder = useMutation({
    mutationFn: async (id: string) => {
      const folderFiles = (files as FileRecord[]).filter(f => f.folder_id === id);
      await Promise.all(folderFiles.map(f => db.entities.SOP_File.delete(f.id)));
      await db.entities.SOP_Folder.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sop_folders'] });
      queryClient.invalidateQueries({ queryKey: ['sop_files'] });
      if (openFolder) setOpenFolder(null);
    },
  });

  const createFile = useMutation({
    mutationFn: (data: Record<string, unknown>) => db.entities.SOP_File.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sop_files'] }),
  });

  const updateFile = useMutation({
    mutationFn: ({ id, ...data }: FileRecord) => db.entities.SOP_File.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['sop_files'] }); setEditingFile(null); },
  });

  const deleteFile = useMutation({
    mutationFn: (id: string) => db.entities.SOP_File.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sop_files'] }),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes('pdf')) { toast.error('Only PDF files are supported'); return; }
    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    await createFile.mutateAsync({
      file_name: file.name.replace(/\.pdf$/i, ''),
      pdf_url: file_url,
      folder_id: openFolder?.id || null,
      color_code: COLOR_PALETTE[0],
    });
    setUploading(false);
    toast.success('File uploaded!');
    e.target.value = '';
  };

  const handleFileDrop = async (folderId: string) => {
    if (!draggingFile) return;
    await updateFile.mutateAsync({ ...draggingFile, folder_id: folderId });
    setDraggingFile(null);
    setDragOverFolder(null);
    toast.success('File moved!');
  };

  const visibleFiles = openFolder
    ? (files as FileRecord[]).filter(f => f.folder_id === openFolder.id)
    : (files as FileRecord[]).filter(f => !f.folder_id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {openFolder && (
            <button onClick={() => setOpenFolder(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-foreground">
              <ChevronLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{openFolder ? openFolder.folder_name : 'Protocol Library'}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {openFolder ? `${visibleFiles.length} file(s)` : `${(folders as FolderRecord[]).length} folders · ${(files as FileRecord[]).length} files`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!openFolder && (
            <Button variant="outline" size="sm" onClick={() => setShowNewFolder(true)}>
              <FolderPlus size={15} className="mr-1.5" /> New Folder
            </Button>
          )}
          <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload size={15} className="mr-1.5" /> {uploading ? 'Uploading…' : 'Upload PDF'}
          </Button>
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {!openFolder && (folders as FolderRecord[]).map(folder => (
          <motion.div
            key={folder.id}
            layout
            className={`group relative bg-card border-2 rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all hover:shadow-md ${
              dragOverFolder === folder.id ? 'border-primary shadow-lg scale-105' : 'border-border'
            }`}
            onClick={() => setOpenFolder(folder)}
            onDragOver={e => { e.preventDefault(); setDragOverFolder(folder.id); }}
            onDragLeave={() => setDragOverFolder(null)}
            onDrop={e => { e.preventDefault(); handleFileDrop(folder.id); }}
          >
            <Folder size={44} style={{ color: folder.color_code || COLOR_PALETTE[0] }} fill={folder.color_code || COLOR_PALETTE[0]} className="opacity-90" />
            <span className="text-xs font-medium text-center text-foreground leading-tight line-clamp-2 w-full">{folder.folder_name}</span>
            <span className="text-xs text-muted-foreground">{(files as FileRecord[]).filter(f => f.folder_id === folder.id).length} files</span>
            <div className="absolute top-2 right-2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 rounded hover:bg-muted" onClick={e => { e.stopPropagation(); setEditingFolder({ ...folder }); }}>
                <Pencil size={11} />
              </button>
              <button className="p-1 rounded hover:bg-destructive/10 text-destructive" onClick={e => { e.stopPropagation(); deleteFolder.mutate(folder.id); }}>
                <Trash2 size={11} />
              </button>
            </div>
          </motion.div>
        ))}

        {visibleFiles.map(file => (
          <motion.div
            key={file.id}
            layout
            draggable={!openFolder}
            onDragStart={() => setDraggingFile(file)}
            onDragEnd={() => setDraggingFile(null)}
            className="group relative bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:shadow-md transition-all"
            onClick={() => file.pdf_url && window.open(file.pdf_url, '_blank')}
          >
            <FileText size={40} style={{ color: file.color_code || COLOR_PALETTE[0] }} className="opacity-90" />
            <span className="text-xs font-medium text-center text-foreground leading-tight line-clamp-2 w-full">{file.file_name}</span>
            <span className="text-xs text-muted-foreground">PDF</span>
            <div className="absolute top-2 right-2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 rounded hover:bg-muted" onClick={e => { e.stopPropagation(); setEditingFile({ ...file }); }}>
                <Pencil size={11} />
              </button>
              <button className="p-1 rounded hover:bg-destructive/10 text-destructive" onClick={e => { e.stopPropagation(); deleteFile.mutate(file.id); }}>
                <Trash2 size={11} />
              </button>
            </div>
          </motion.div>
        ))}

        {visibleFiles.length === 0 && (!openFolder ? (folders as FolderRecord[]).length === 0 : true) && (
          <div className="col-span-full py-16 text-center text-muted-foreground text-sm">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
            {openFolder ? 'No files yet. Upload a PDF above.' : 'No folders or files yet.'}
          </div>
        )}
      </div>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolder} onOpenChange={setShowNewFolder}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>New Folder</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Folder Name</Label>
              <Input placeholder="e.g. Cell Line Maintenance" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} autoFocus />
            </div>
            <ColorPicker value={newFolderColor} onChange={setNewFolderColor} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolder(false)}>Cancel</Button>
            <Button disabled={!newFolderName.trim()} onClick={() => createFolder.mutate({ folder_name: newFolderName.trim(), color_code: newFolderColor })}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Folder Dialog */}
      <Dialog open={!!editingFolder} onOpenChange={v => !v && setEditingFolder(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Edit Folder</DialogTitle></DialogHeader>
          {editingFolder && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Folder Name</Label>
                <Input value={editingFolder.folder_name} onChange={e => setEditingFolder(f => f ? { ...f, folder_name: e.target.value } : f)} />
              </div>
              <ColorPicker value={editingFolder.color_code || COLOR_PALETTE[0]} onChange={c => setEditingFolder(f => f ? { ...f, color_code: c } : f)} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFolder(null)}>Cancel</Button>
            <Button onClick={() => editingFolder && updateFolder.mutate(editingFolder)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit File Dialog */}
      <Dialog open={!!editingFile} onOpenChange={v => !v && setEditingFile(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Rename File</DialogTitle></DialogHeader>
          {editingFile && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>File Name</Label>
                <Input value={editingFile.file_name} onChange={e => setEditingFile(f => f ? { ...f, file_name: e.target.value } : f)} />
              </div>
              <ColorPicker value={editingFile.color_code || COLOR_PALETTE[0]} onChange={c => setEditingFile(f => f ? { ...f, color_code: c } : f)} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFile(null)}>Cancel</Button>
            <Button onClick={() => editingFile && updateFile.mutate(editingFile)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
