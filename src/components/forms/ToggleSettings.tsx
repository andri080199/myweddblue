'use client';

import { useState, useEffect } from 'react';

interface ToggleSettingsProps {
  clientSlug: string;
  contentType: string;
  title: string;
  defaultData: any;
  toggles: {
    key: string;
    label: string;
    description?: string;
  }[];
  onSave?: (data: any) => void;
}

const ToggleSettings: React.FC<ToggleSettingsProps> = ({
  clientSlug,
  contentType,
  title,
  defaultData,
  toggles,
  onSave
}) => {
  const [formData, setFormData] = useState(defaultData);
  const [saving, setSaving] = useState(false);
  const [currentData, setCurrentData] = useState(defaultData);

  useEffect(() => {
    fetchCurrentData();
  }, [clientSlug, contentType]);

  const fetchCurrentData = async () => {
    try {
      const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=${contentType}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const savedData = data[0].content_data;
          // Convert string to boolean for saved data
          const convertedData = {};
          Object.keys(savedData).forEach(key => {
            const value = savedData[key];
            convertedData[key] = value === 'true' || value === true;
          });
          setCurrentData(convertedData);
          setFormData(convertedData);
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const handleToggle = (key: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/client-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientSlug,
          contentType,
          contentData: formData
        }),
      });

      if (response.ok) {
        setCurrentData(formData);
        onSave?.(formData);
        alert('Pengaturan berhasil disimpan!');
      } else {
        alert('Gagal menyimpan pengaturan');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(currentData);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <div className="space-y-4">
        {toggles.map((toggle) => (
          <div key={toggle.key} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                {toggle.label}
              </label>
              {toggle.description && (
                <p className="text-xs text-gray-500 mt-1">{toggle.description}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleToggle(toggle.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  formData[toggle.key] ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData[toggle.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 text-sm font-medium ${formData[toggle.key] ? 'text-green-600' : 'text-gray-400'}`}>
                {formData[toggle.key] ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {hasChanges && (
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 font-semibold"
          >
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ToggleSettings;