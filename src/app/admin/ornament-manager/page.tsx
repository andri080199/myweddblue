'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, EyeOff, Edit2, Trash2, Save, RefreshCw, ExternalLink, Sparkles } from 'lucide-react';
import { Ornament, SectionId, SECTION_LABELS } from '@/types/ornament';
import OrnamentModal from '@/components/admin/OrnamentModal';

export default function OrnamentManagerPage() {
  const [clients, setClients] = useState<Array<{ id: number; slug: string }>>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedSection, setSelectedSection] = useState<SectionId>('welcome');
  const [ornaments, setOrnaments] = useState<Ornament[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrnament, setEditingOrnament] = useState<Ornament | null>(null);

  // Fetch clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch ornaments when client changes
  useEffect(() => {
    if (selectedClient) {
      fetchOrnaments();
    }
  }, [selectedClient]);

  async function fetchClients() {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
        if (data.length > 0) {
          setSelectedClient(data[0].slug);
        }
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  }

  async function fetchOrnaments() {
    if (!selectedClient) return;

    setLoading(true);
    try {
      console.log('📡 Fetching ornaments for:', selectedClient);

      const response = await fetch(
        `/api/client-ornaments?clientSlug=${selectedClient}`
      );
      const data = await response.json();

      if (data.success) {
        setOrnaments(data.data.ornaments || []);
        console.log('✅ Ornaments loaded:', data.data.ornaments?.length || 0);
      } else {
        console.error('❌ Failed to fetch ornaments:', data.error);
        setOrnaments([]);
      }
    } catch (error) {
      console.error('❌ Error fetching ornaments:', error);
      setOrnaments([]);
    } finally {
      setLoading(false);
    }
  }

  async function saveOrnaments() {
    if (!selectedClient) {
      alert('Please select a client');
      return;
    }

    setSaving(true);
    try {
      console.log('💾 Saving ornaments:', {
        clientSlug: selectedClient,
        count: ornaments.length,
      });

      const response = await fetch('/api/client-ornaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientSlug: selectedClient,
          ornaments: ornaments,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Ornaments saved successfully');
        alert('Ornaments saved successfully!');
      } else {
        console.error('❌ Failed to save ornaments:', data.error);
        alert(`Failed to save: ${data.error}`);
      }
    } catch (error) {
      console.error('❌ Error saving ornaments:', error);
      alert('Failed to save ornaments. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleAddOrnament(ornament: Ornament) {
    if (editingOrnament) {
      // Update existing ornament
      setOrnaments(ornaments.map(o => o.id === ornament.id ? ornament : o));
    } else {
      // Add new ornament
      setOrnaments([...ornaments, ornament]);
    }
    setEditingOrnament(null);
  }

  function handleEditOrnament(ornament: Ornament) {
    setEditingOrnament(ornament);
    setIsModalOpen(true);
  }

  function handleDeleteOrnament(ornamentId: string) {
    if (confirm('Are you sure you want to delete this ornament?')) {
      setOrnaments(ornaments.filter(o => o.id !== ornamentId));
    }
  }

  function toggleOrnamentVisibility(ornamentId: string) {
    setOrnaments(ornaments.map(o =>
      o.id === ornamentId ? { ...o, isVisible: !o.isVisible } : o
    ));
  }

  // Filter ornaments by selected section
  const sectionOrnaments = ornaments.filter(o => o.section === selectedSection);
  const totalOrnaments = ornaments.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ornament Manager</h1>
              <p className="text-gray-600 mt-1">Manage decorative elements for wedding invitations</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Client Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Client
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.slug}>
                    {client.slug}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value as SectionId)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {Object.entries(SECTION_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2">
              <button
                onClick={() => {
                  setEditingOrnament(null);
                  setIsModalOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Plus size={20} />
                Add Ornament
              </button>
              <button
                onClick={fetchOrnaments}
                disabled={loading}
                className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-gray-500">Total Ornaments:</span>
                <span className="ml-2 font-bold text-gray-900">{totalOrnaments}</span>
              </div>
              <div>
                <span className="text-gray-500">In This Section:</span>
                <span className="ml-2 font-bold text-purple-600">{sectionOrnaments.length}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveOrnaments}
                disabled={saving || !selectedClient}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              {selectedClient && (
                <a
                  href={`/undangan/${selectedClient}/preview`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <ExternalLink size={18} />
                  Preview
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Ornaments List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Ornaments in {SECTION_LABELS[selectedSection]}
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : sectionOrnaments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No ornaments yet</h3>
              <p className="text-gray-500 mb-4">Add your first decorative element to this section</p>
              <button
                onClick={() => {
                  setEditingOrnament(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Plus size={20} />
                Add Ornament
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sectionOrnaments.map((ornament) => (
                <div
                  key={ornament.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50/50 transition-all"
                >
                  {/* Preview Image */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    <img
                      src={ornament.image}
                      alt={ornament.name}
                      className="w-full h-full object-contain"
                      style={{
                        transform: `scale(${ornament.transform.scale}) rotate(${ornament.transform.rotate}deg)`,
                        opacity: ornament.style.opacity,
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{ornament.name}</h3>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                      <span>Position: {ornament.position.top}, {ornament.position.left}</span>
                      <span>Scale: {ornament.transform.scale}x</span>
                      <span>Rotation: {ornament.transform.rotate}°</span>
                      <span>Z-Index: {ornament.style.zIndex}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleOrnamentVisibility(ornament.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        ornament.isVisible
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={ornament.isVisible ? 'Hide' : 'Show'}
                    >
                      {ornament.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button
                      onClick={() => handleEditOrnament(ornament)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteOrnament(ornament.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ornament Modal */}
      <OrnamentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOrnament(null);
        }}
        onSave={handleAddOrnament}
        editingOrnament={editingOrnament}
        currentSection={selectedSection}
      />
    </div>
  );
}
