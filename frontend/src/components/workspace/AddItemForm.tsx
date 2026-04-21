import { useState } from 'react';
import { Plus } from 'lucide-react';

export interface ItemFormData {
  id: string;
  name: string;
  description: string;
}

interface AddItemFormProps {
  onItemAdded?: (itemData: ItemFormData) => void;
}

export function AddItemForm({ onItemAdded }: AddItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<ItemFormData>({
    id: '',
    name: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.id || !formData.name || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Send to backend API
      const response = await fetch('http://localhost:8003/api/v1/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item');
      }

      await response.json();
      
      // Show success message
      setSuccess(`Item "${formData.name}" added successfully!`);
      
      // Call callback if provided
      if (onItemAdded) {
        onItemAdded(formData);
      }
      
      // Reset form
      setFormData({
        id: '',
        name: '',
        description: '',
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-background/50">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2.5 bg-primary/10 rounded-lg">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Add New Item</h2>
            <p className="text-muted-foreground text-sm">Add items to your inventory database</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500 text-green-600 rounded-lg text-sm">
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ID */}
            <div>
              <label htmlFor="id" className="block text-sm font-medium mb-1.5">
                ID *
              </label>
              <input
                id="id"
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="Enter product ID"
                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                Product Name *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1.5">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Adding Item...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Item to Database
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
