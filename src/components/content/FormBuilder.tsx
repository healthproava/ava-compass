import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Save, Download, FormInput } from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormBuilderProps {
  initialData?: {
    title?: string;
    fields?: FormField[];
  };
  onSave?: (formData: any) => void;
  onDownload?: () => void;
}

const FormBuilder = ({ initialData, onSave, onDownload }: FormBuilderProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    fields: initialData?.fields || []
  });

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Button' }
  ];

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
      options: []
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const renderFieldPreview = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <Input 
            type={field.type} 
            placeholder={field.placeholder || field.label}
            disabled
          />
        );
      case 'textarea':
        return (
          <Textarea 
            placeholder={field.placeholder || field.label}
            disabled
          />
        );
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
          </Select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox disabled />
            <Label>{field.label}</Label>
          </div>
        );
      default:
        return <Input placeholder={field.label} disabled />;
    }
  };

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FormInput className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Form Builder</h2>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button size="sm" onClick={() => onSave?.(formData)}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 h-full">
        {/* Form Builder */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="form-title">Form Title</Label>
            <Input
              id="form-title"
              placeholder="Enter form title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Form Fields</Label>
              <Button size="sm" onClick={addField}>
                <Plus className="h-4 w-4 mr-1" />
                Add Field
              </Button>
            </div>

            {formData.fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Field {index + 1}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeField(field.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Field Type</Label>
                      <Select 
                        value={field.type} 
                        onValueChange={(value) => updateField(field.id, { type: value as any })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox 
                        checked={field.required}
                        onCheckedChange={(checked) => updateField(field.id, { required: !!checked })}
                      />
                      <Label className="text-xs">Required</Label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Label</Label>
                    <Input
                      className="h-8"
                      placeholder="Field label"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Placeholder</Label>
                    <Input
                      className="h-8"
                      placeholder="Placeholder text"
                      value={field.placeholder || ''}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Form Preview */}
        <div className="border-l pl-6">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <Card className="p-4">
            <h4 className="text-xl font-semibold mb-4">{formData.title || 'Untitled Form'}</h4>
            <div className="space-y-4">
              {formData.fields.map((field) => (
                <div key={field.id}>
                  <Label className="text-sm">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  {renderFieldPreview(field)}
                </div>
              ))}
              
              {formData.fields.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  Add fields to see the form preview
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default FormBuilder;