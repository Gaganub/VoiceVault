import React, { useState, useEffect } from 'react';
import { X, Trash2, AlertTriangle, RotateCcw, Clock, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Memory } from '../../types';

interface DeleteModalProps {
  memory: Memory | Memory[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (permanent?: boolean) => void;
  isBatch?: boolean;
}

interface DeletedMemory extends Memory {
  deletedAt: Date;
  recoveryDeadline: Date;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  memory,
  isOpen,
  onClose,
  onConfirm,
  isBatch = false
}) => {
  const { theme } = useTheme();
  const [deleteType, setDeleteType] = useState<'soft' | 'permanent'>('soft');
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [deletedMemories, setDeletedMemories] = useState<DeletedMemory[]>([]);

  const memories = Array.isArray(memory) ? memory : [memory];
  const requiredConfirmText = isBatch ? 'DELETE ALL' : 'DELETE';

  useEffect(() => {
    if (isOpen) {
      loadDeletedMemories();
    }
  }, [isOpen]);

  const loadDeletedMemories = () => {
    const saved = localStorage.getItem('deleted-memories');
    if (saved) {
      const deleted = JSON.parse(saved).map((m: any) => ({
        ...m,
        deletedAt: new Date(m.deletedAt),
        recoveryDeadline: new Date(m.recoveryDeadline),
        timestamp: new Date(m.timestamp)
      }));
      setDeletedMemories(deleted);
    }
  };

  const handleDelete = async () => {
    if (deleteType === 'permanent' && confirmText !== requiredConfirmText) {
      return;
    }

    setIsDeleting(true);
    
    try {
      if (deleteType === 'soft') {
        // Move to recycle bin
        const now = new Date();
        const recoveryDeadline = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        
        const deletedItems = memories.map(m => ({
          ...m,
          deletedAt: now,
          recoveryDeadline
        }));
        
        const existingDeleted = JSON.parse(localStorage.getItem('deleted-memories') || '[]');
        const updatedDeleted = [...existingDeleted, ...deletedItems];
        localStorage.setItem('deleted-memories', JSON.stringify(updatedDeleted));
        
        setDeletedMemories(updatedDeleted);
      }
      
      await onConfirm(deleteType === 'permanent');
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const recoverMemory = (memoryId: string) => {
    const updated = deletedMemories.filter(m => m.id !== memoryId);
    setDeletedMemories(updated);
    localStorage.setItem('deleted-memories', JSON.stringify(updated));
    
    // In real app, this would restore the memory to the main collection
    alert('Memory recovered successfully!');
  };

  const permanentlyDelete = (memoryId: string) => {
    if (window.confirm('This will permanently delete the memory. This action cannot be undone.')) {
      const updated = deletedMemories.filter(m => m.id !== memoryId);
      setDeletedMemories(updated);
      localStorage.setItem('deleted-memories', JSON.stringify(updated));
    }
  };

  const cleanupExpired = () => {
    const now = new Date();
    const updated = deletedMemories.filter(m => m.recoveryDeadline > now);
    setDeletedMemories(updated);
    localStorage.setItem('deleted-memories', JSON.stringify(updated));
    alert('Expired memories cleaned up!');
  };

  const getDaysUntilExpiry = (deadline: Date): number => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: `${theme.colors.background}80` }}
        onClick={onClose}
      />
      
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl backdrop-blur-sm border border-opacity-20"
        style={{ 
          backgroundColor: `${theme.colors.surface}95`,
          borderColor: theme.colors.accent 
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-opacity-20" style={{ borderColor: theme.colors.accent }}>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: theme.colors.text }}>
              {showRecycleBin ? 'Recycle Bin' : 'Delete Memory'}
            </h2>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              {showRecycleBin 
                ? 'Manage deleted memories and recovery options'
                : isBatch 
                ? `Delete ${memories.length} selected memories`
                : `Delete "${memories[0]?.title}"`
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {!showRecycleBin && (
              <button
                onClick={() => setShowRecycleBin(true)}
                className="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: `${theme.colors.accent}20`,
                  color: theme.colors.accent 
                }}
              >
                View Recycle Bin
              </button>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ backgroundColor: `${theme.colors.surface}40` }}
            >
              <X className="w-5 h-5" style={{ color: theme.colors.textSecondary }} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {showRecycleBin ? (
            /* Recycle Bin View */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: theme.colors.text }}>
                    Deleted Memories ({deletedMemories.length})
                  </h3>
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    Memories are automatically deleted after 30 days
                  </p>
                </div>
                
                {deletedMemories.length > 0 && (
                  <button
                    onClick={cleanupExpired}
                    className="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                    style={{ 
                      backgroundColor: `${theme.colors.primary}20`,
                      color: theme.colors.primary 
                    }}
                  >
                    Clean Up Expired
                  </button>
                )}
              </div>

              {deletedMemories.length === 0 ? (
                <div 
                  className="p-8 rounded-xl text-center"
                  style={{ backgroundColor: `${theme.colors.surface}40` }}
                >
                  <Trash2 className="w-16 h-16 mx-auto mb-4" style={{ color: theme.colors.textSecondary }} />
                  <h3 className="text-lg font-bold mb-2" style={{ color: theme.colors.text }}>
                    Recycle Bin is Empty
                  </h3>
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    Deleted memories will appear here for 30 days before permanent deletion
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deletedMemories.map((deletedMemory) => {
                    const daysLeft = getDaysUntilExpiry(deletedMemory.recoveryDeadline);
                    const isExpiringSoon = daysLeft <= 7;
                    
                    return (
                      <div
                        key={deletedMemory.id}
                        className={`p-4 rounded-xl border border-opacity-20 ${isExpiringSoon ? 'border-red-400' : ''}`}
                        style={{ 
                          backgroundColor: `${theme.colors.surface}40`,
                          borderColor: isExpiringSoon ? '#ef4444' : theme.colors.accent 
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold mb-1" style={{ color: theme.colors.text }}>
                              {deletedMemory.title}
                            </h4>
                            <p className="text-sm mb-2 line-clamp-2" style={{ color: theme.colors.textSecondary }}>
                              {deletedMemory.content}
                            </p>
                            <div className="flex items-center space-x-4 text-xs" style={{ color: theme.colors.textSecondary }}>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>Deleted {deletedMemory.deletedAt.toLocaleDateString()}</span>
                              </div>
                              <div className={`flex items-center space-x-1 ${isExpiringSoon ? 'text-red-400' : ''}`}>
                                <AlertTriangle className="w-3 h-3" />
                                <span>
                                  {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => recoverMemory(deletedMemory.id)}
                              className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                              style={{ 
                                backgroundColor: `${theme.colors.primary}20`,
                                color: theme.colors.primary 
                              }}
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Recover</span>
                            </button>
                            <button
                              onClick={() => permanentlyDelete(deletedMemory.id)}
                              className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-red-400 hover:bg-red-400 hover:bg-opacity-20"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <button
                onClick={() => setShowRecycleBin(false)}
                className="w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: `${theme.colors.surface}60`,
                  color: theme.colors.text 
                }}
              >
                Back to Delete Options
              </button>
            </div>
          ) : (
            /* Delete Options View */
            <div className="space-y-6">
              {/* Warning */}
              <div 
                className="p-4 rounded-xl flex items-start space-x-3"
                style={{ backgroundColor: '#f59e0b30', border: '1px solid #f59e0b' }}
              >
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-yellow-600 font-medium">
                    {isBatch ? 'Batch Delete Warning' : 'Delete Warning'}
                  </p>
                  <p className="text-yellow-600 text-sm">
                    {isBatch 
                      ? `You are about to delete ${memories.length} memories. This action affects multiple items.`
                      : 'You are about to delete this memory. Choose your deletion method carefully.'
                    }
                  </p>
                </div>
              </div>

              {/* Memory Preview */}
              <div>
                <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.text }}>
                  {isBatch ? 'Selected Memories' : 'Memory to Delete'}
                </h3>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {memories.slice(0, 5).map((mem) => (
                    <div
                      key={mem.id}
                      className="p-3 rounded-lg border border-opacity-20"
                      style={{ 
                        backgroundColor: `${theme.colors.surface}40`,
                        borderColor: theme.colors.accent 
                      }}
                    >
                      <h4 className="font-medium mb-1" style={{ color: theme.colors.text }}>
                        {mem.title}
                      </h4>
                      <p className="text-sm line-clamp-2" style={{ color: theme.colors.textSecondary }}>
                        {mem.content}
                      </p>
                      <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                        {new Date(mem.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {memories.length > 5 && (
                    <div 
                      className="p-3 rounded-lg text-center"
                      style={{ backgroundColor: `${theme.colors.surface}40` }}
                    >
                      <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        +{memories.length - 5} more memories
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delete Options */}
              <div>
                <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.text }}>
                  Deletion Method
                </h3>
                
                <div className="space-y-3">
                  <label 
                    className={`flex items-start space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      deleteType === 'soft' ? 'scale-105' : ''
                    }`}
                    style={{
                      backgroundColor: `${theme.colors.surface}40`,
                      borderColor: deleteType === 'soft' ? theme.colors.primary : theme.colors.accent,
                    }}
                  >
                    <input
                      type="radio"
                      name="deleteType"
                      value="soft"
                      checked={deleteType === 'soft'}
                      onChange={(e) => setDeleteType(e.target.value as 'soft')}
                      className="mt-1"
                    />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Trash2 className="w-5 h-5" style={{ color: theme.colors.primary }} />
                        <span className="font-medium" style={{ color: theme.colors.text }}>
                          Move to Recycle Bin (Recommended)
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        Memories will be moved to recycle bin and can be recovered within 30 days. 
                        After 30 days, they will be automatically deleted permanently.
                      </p>
                    </div>
                  </label>

                  <label 
                    className={`flex items-start space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      deleteType === 'permanent' ? 'scale-105' : ''
                    }`}
                    style={{
                      backgroundColor: `${theme.colors.surface}40`,
                      borderColor: deleteType === 'permanent' ? '#ef4444' : theme.colors.accent,
                    }}
                  >
                    <input
                      type="radio"
                      name="deleteType"
                      value="permanent"
                      checked={deleteType === 'permanent'}
                      onChange={(e) => setDeleteType(e.target.value as 'permanent')}
                      className="mt-1"
                    />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span className="font-medium text-red-400">
                          Delete Permanently
                        </span>
                      </div>
                      <p className="text-sm text-red-300">
                        Memories will be deleted immediately and cannot be recovered. 
                        This action is irreversible.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Confirmation for Permanent Delete */}
              {deleteType === 'permanent' && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                    Type "{requiredConfirmText}" to confirm permanent deletion
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={requiredConfirmText}
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all"
                    style={{ 
                      backgroundColor: `${theme.colors.surface}40`,
                      borderColor: '#ef4444',
                      color: theme.colors.text,
                      '--tw-ring-color': '#ef4444' 
                    } as React.CSSProperties}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="px-6 py-3 rounded-xl font-medium border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                  style={{ 
                    borderColor: theme.colors.textSecondary,
                    color: theme.colors.textSecondary 
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || (deleteType === 'permanent' && confirmText !== requiredConfirmText)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
                  style={{ 
                    backgroundColor: deleteType === 'permanent' ? '#ef4444' : theme.colors.primary,
                    color: theme.colors.background 
                  }}
                >
                  {isDeleting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      <span>
                        {deleteType === 'permanent' ? 'Delete Permanently' : 'Move to Recycle Bin'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};