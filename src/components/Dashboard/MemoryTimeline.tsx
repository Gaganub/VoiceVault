import React, { useState } from 'react';
import { Search, Filter, Plus, Grid, List, Calendar, SortAsc, SortDesc, Trash2, Share2, CheckSquare, Square } from 'lucide-react';
import { Memory } from '../../types';
import { MemoryCard } from './MemoryCard';
import { MemoryEditModal } from '../Memory/MemoryEditModal';
import { ShareModal } from '../Memory/ShareModal';
import { DeleteModal } from '../Memory/DeleteModal';
import { useTheme } from '../../contexts/ThemeContext';

interface MemoryTimelineProps {
  memories: Memory[];
  onCreateMemory: () => void;
  onPlayMemory?: (memory: Memory) => void;
  onEditMemory?: (memory: Memory) => void;
  onShareMemory?: (memory: Memory) => void;
  onDeleteMemory?: (memory: Memory) => void;
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({ 
  memories, 
  onCreateMemory, 
  onPlayMemory,
  onEditMemory,
  onShareMemory,
  onDeleteMemory
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'mood'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedMemories, setSelectedMemories] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  // Modal states
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [sharingMemory, setSharingMemory] = useState<Memory | null>(null);
  const [deletingMemory, setDeletingMemory] = useState<Memory | Memory[] | null>(null);

  const filteredAndSortedMemories = memories
    .filter(memory => {
      const matchesSearch = memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           memory.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMood = selectedMood === 'all' || memory.mood === selectedMood;
      const matchesTag = selectedTag === 'all' || memory.tags.includes(selectedTag);
      return matchesSearch && matchesMood && matchesTag;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'mood':
          comparison = a.mood.localeCompare(b.mood);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const moods = ['all', 'happy', 'sad', 'neutral', 'excited', 'reflective'];
  const allTags = Array.from(new Set(memories.flatMap(m => m.tags)));
  const tags = ['all', ...allTags];

  const handleMemorySelect = (memory: Memory, selected: boolean) => {
    const newSelected = new Set(selectedMemories);
    if (selected) {
      newSelected.add(memory.id);
    } else {
      newSelected.delete(memory.id);
    }
    setSelectedMemories(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedMemories.size === filteredAndSortedMemories.length) {
      setSelectedMemories(new Set());
    } else {
      setSelectedMemories(new Set(filteredAndSortedMemories.map(m => m.id)));
    }
  };

  const handleBatchDelete = () => {
    const memoriesToDelete = memories.filter(m => selectedMemories.has(m.id));
    setDeletingMemory(memoriesToDelete);
  };

  const handleBatchShare = () => {
    // For demo, just share the first selected memory
    const firstSelected = memories.find(m => selectedMemories.has(m.id));
    if (firstSelected) {
      setSharingMemory(firstSelected);
    }
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedMemories(new Set());
  };

  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory);
  };

  const handleShare = (memory: Memory) => {
    setSharingMemory(memory);
  };

  const handleDelete = (memory: Memory) => {
    setDeletingMemory(memory);
  };

  const handleSaveEdit = async (updatedMemory: Memory) => {
    // Update the memory in the parent component
    if (onEditMemory) {
      await onEditMemory(updatedMemory);
    }
    setEditingMemory(null);
  };

  const handleConfirmDelete = async (permanent?: boolean) => {
    if (Array.isArray(deletingMemory)) {
      // Batch delete
      for (const memory of deletingMemory) {
        if (onDeleteMemory) {
          await onDeleteMemory(memory);
        }
      }
      setSelectedMemories(new Set());
      setIsSelectionMode(false);
    } else if (deletingMemory) {
      // Single delete
      if (onDeleteMemory) {
        await onDeleteMemory(deletingMemory);
      }
    }
    setDeletingMemory(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: theme.colors.text }}
          >
            Your Memory Vault
          </h1>
          <p 
            className="text-lg"
            style={{ color: theme.colors.textSecondary }}
          >
            {filteredAndSortedMemories.length} of {memories.length} memories
            {selectedMemories.size > 0 && (
              <span className="ml-2" style={{ color: theme.colors.primary }}>
                • {selectedMemories.size} selected
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isSelectionMode ? (
            <>
              <button
                onClick={handleBatchShare}
                disabled={selectedMemories.size === 0}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
                style={{ 
                  backgroundColor: `${theme.colors.secondary}30`,
                  color: theme.colors.secondary 
                }}
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={handleBatchDelete}
                disabled={selectedMemories.size === 0}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 text-red-400 hover:bg-red-400 hover:bg-opacity-20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
              <button
                onClick={exitSelectionMode}
                className="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: `${theme.colors.surface}60`,
                  color: theme.colors.textSecondary 
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsSelectionMode(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: `${theme.colors.accent}30`,
                  color: theme.colors.accent 
                }}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Select</span>
              </button>
              <button
                onClick={onCreateMemory}
                className="group flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.background 
                }}
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                <span>New Memory</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div 
        className="p-6 rounded-2xl backdrop-blur-sm border border-opacity-30 mb-8"
        style={{ 
          backgroundColor: `${theme.colors.surface}60`,
          borderColor: theme.colors.accent 
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
              style={{ color: theme.colors.textSecondary }}
            />
            <input
              type="text"
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all"
              style={{ 
                backgroundColor: `${theme.colors.surface}40`,
                borderColor: theme.colors.accent,
                color: theme.colors.text,
                '--tw-ring-color': theme.colors.primary 
              } as React.CSSProperties}
            />
          </div>

          {/* Mood Filter */}
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all capitalize"
            style={{ 
              backgroundColor: `${theme.colors.surface}40`,
              borderColor: theme.colors.accent,
              color: theme.colors.text,
              '--tw-ring-color': theme.colors.primary 
            } as React.CSSProperties}
          >
            {moods.map(mood => (
              <option key={mood} value={mood} className="capitalize">
                {mood === 'all' ? 'All Moods' : mood}
              </option>
            ))}
          </select>

          {/* Tag Filter */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all capitalize"
            style={{ 
              backgroundColor: `${theme.colors.surface}40`,
              borderColor: theme.colors.accent,
              color: theme.colors.text,
              '--tw-ring-color': theme.colors.primary 
            } as React.CSSProperties}
          >
            {tags.map(tag => (
              <option key={tag} value={tag} className="capitalize">
                {tag === 'all' ? 'All Tags' : tag}
              </option>
            ))}
          </select>

          {/* Sort */}
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'mood')}
              className="flex-1 px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all"
              style={{ 
                backgroundColor: `${theme.colors.surface}40`,
                borderColor: theme.colors.accent,
                color: theme.colors.text,
                '--tw-ring-color': theme.colors.primary 
              } as React.CSSProperties}
            >
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="mood">Mood</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: `${theme.colors.surface}40`,
                borderColor: theme.colors.accent,
                color: theme.colors.textSecondary 
              }}
            >
              {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* View Mode Toggle and Batch Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter 
              className="w-4 h-4" 
              style={{ color: theme.colors.textSecondary }}
            />
            <span 
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              {filteredAndSortedMemories.length} results
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {isSelectionMode && (
              <button
                onClick={handleSelectAll}
                className="flex items-center space-x-2 text-sm transition-all duration-200 hover:scale-105"
                style={{ color: theme.colors.primary }}
              >
                {selectedMemories.size === filteredAndSortedMemories.length ? (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    <span>Deselect All</span>
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" />
                    <span>Select All</span>
                  </>
                )}
              </button>
            )}
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' ? 'scale-110' : ''
                }`}
                style={{
                  backgroundColor: viewMode === 'grid' ? `${theme.colors.primary}30` : 'transparent',
                  color: viewMode === 'grid' ? theme.colors.primary : theme.colors.textSecondary,
                }}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' ? 'scale-110' : ''
                }`}
                style={{
                  backgroundColor: viewMode === 'list' ? `${theme.colors.primary}30` : 'transparent',
                  color: viewMode === 'list' ? theme.colors.primary : theme.colors.textSecondary,
                }}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Grid/List */}
      {filteredAndSortedMemories.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredAndSortedMemories.map((memory) => (
            <MemoryCard 
              key={memory.id} 
              memory={memory}
              onPlay={onPlayMemory}
              onEdit={handleEdit}
              onShare={handleShare}
              onDelete={handleDelete}
              isSelected={selectedMemories.has(memory.id)}
              onSelect={isSelectionMode ? handleMemorySelect : undefined}
            />
          ))}
        </div>
      ) : (
        <div 
          className="text-center py-16 rounded-2xl backdrop-blur-sm border border-opacity-30"
          style={{ 
            backgroundColor: `${theme.colors.surface}40`,
            borderColor: theme.colors.accent 
          }}
        >
          <div className="max-w-md mx-auto">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${theme.colors.primary}20` }}
            >
              <Search 
                className="w-8 h-8" 
                style={{ color: theme.colors.primary }}
              />
            </div>
            <h3 
              className="text-xl font-bold mb-2"
              style={{ color: theme.colors.text }}
            >
              No memories found
            </h3>
            <p 
              className="mb-6"
              style={{ color: theme.colors.textSecondary }}
            >
              {searchTerm || selectedMood !== 'all' || selectedTag !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start capturing your precious moments'}
            </p>
            <button
              onClick={onCreateMemory}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.background 
              }}
            >
              Create Your First Memory
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {editingMemory && (
        <MemoryEditModal
          memory={editingMemory}
          isOpen={true}
          onClose={() => setEditingMemory(null)}
          onSave={handleSaveEdit}
        />
      )}

      {sharingMemory && (
        <ShareModal
          memory={sharingMemory}
          isOpen={true}
          onClose={() => setSharingMemory(null)}
        />
      )}

      {deletingMemory && (
        <DeleteModal
          memory={deletingMemory}
          isOpen={true}
          onClose={() => setDeletingMemory(null)}
          onConfirm={handleConfirmDelete}
          isBatch={Array.isArray(deletingMemory)}
        />
      )}
    </div>
  );
};
