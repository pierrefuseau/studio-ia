import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Video, Clock, Maximize, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

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
      setStatusMessage('Veuillez sélectionner une image');
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
        setStatusMessage('Vidéo en cours de génération !');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Génération de vidéos
          </h1>
          <p className="text-slate-600">
            Créez des vidéos à partir de vos images
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre vidéo..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Maximize className="w-4 h-4 inline mr-1" />
                  Format
                </label>
                <Input
                  type="text"
                  value={format}
                  disabled
                  className="bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Temps
                </label>
                <Input
                  type="text"
                  value={duration}
                  disabled
                  className="bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Image
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <input {...getInputProps()} />
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-slate-600">
                      {uploadedImage?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Cliquez ou glissez pour changer l'image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 mx-auto text-slate-400" />
                    <p className="text-slate-600">
                      {isDragActive
                        ? 'Déposez votre image ici'
                        : 'Glissez une image ou cliquez pour parcourir'}
                    </p>
                    <p className="text-xs text-slate-500">
                      PNG, JPG, JPEG ou WEBP
                    </p>
                  </div>
                )}
              </div>
            </div>

            {submitStatus !== 'idle' && (
              <div className={`flex items-center gap-2 p-4 rounded-lg ${
                submitStatus === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}>
                {submitStatus === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <span>{statusMessage}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi en cours...' : 'Générer la vidéo'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
