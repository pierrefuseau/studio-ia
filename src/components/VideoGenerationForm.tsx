import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Video, Clock, Maximize, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ContentHeader } from './ContentHeader';

const WEBHOOK_URL = 'https://n8n.srv778298.hstgr.cloud/webhook-test/1dd808fb-dae9-45bc-9406-2d948af2effc';

export function VideoGenerationForm() {
  const [description, setDescription] = useState('');
  const [format] = useState('16:9');
  const [duration] = useState('8 secondes');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedImage) {
      setSubmitStatus('error');
      setStatusMessage('Veuillez selectionner une image');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('format', format);
      formData.append('duration', duration);
      formData.append('image', uploadedImage);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setSubmitStatus('success');
        setStatusMessage('Video en cours de generation !');
        setDescription('');
        setUploadedImage(null);
        setPreviewUrl(null);
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage('Erreur lors de l\'envoi de la demande');
      console.error('Webhook error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
      <ContentHeader
        breadcrumbs={[
          { label: 'Generation de videos' },
        ]}
        title="Generation de videos"
        subtitle="Creez des videos dynamiques a partir de vos images produits"
        icon={<Video className="w-5 h-5" />}
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="video-description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              id="video-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Decrivez votre video..."
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuseau-primary/20 focus:border-fuseau-primary hover:border-gray-300 resize-none text-gray-900 placeholder-gray-400 transition-all duration-150"
              rows={4}
              required
              aria-required="true"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label htmlFor="video-format" className="block text-sm font-medium text-gray-700 mb-1.5">
                <Maximize className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                Format
              </label>
              <Input
                id="video-format"
                type="text"
                value={format}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <label htmlFor="video-duration" className="block text-sm font-medium text-gray-700 mb-1.5">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                Temps
              </label>
              <Input
                id="video-duration"
                type="text"
                value={duration}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <div>
            <p className="block text-sm font-medium text-gray-700 mb-1.5" id="image-upload-label">
              Image
            </p>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all duration-150 ${
                isDragActive
                  ? 'border-fuseau-primary bg-gray-50/50'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              }`}
            >
              <input {...getInputProps()} aria-labelledby="image-upload-label" />
              {previewUrl ? (
                <div className="space-y-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-32 sm:max-h-48 mx-auto rounded-lg"
                  />
                  <p className="text-xs text-gray-600">{uploadedImage?.name}</p>
                  <p className="text-[11px] text-gray-400">Cliquez ou glissez pour changer l'image</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-10 h-10 mx-auto text-gray-300" />
                  <p className="text-sm text-gray-500">
                    {isDragActive ? 'Deposez votre image ici' : 'Glissez une image ou cliquez pour parcourir'}
                  </p>
                  <p className="text-[11px] text-gray-400">PNG, JPG, JPEG ou WEBP</p>
                </div>
              )}
            </div>
          </div>

          {submitStatus !== 'idle' && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              submitStatus === 'success'
                ? 'bg-emerald-50 text-emerald-800'
                : 'bg-red-50 text-red-800'
            }`}>
              {submitStatus === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="text-xs">{statusMessage}</span>
            </div>
          )}

          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting} aria-label="Generer la video">
            {isSubmitting ? 'Envoi en cours...' : 'Generer la video'}
          </Button>
        </form>
      </div>
    </div>
  );
}
