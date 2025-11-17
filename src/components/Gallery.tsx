import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  Download,
  Trash2,
  Filter,
  Search,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { HistoryItem } from '../types';

export function Gallery() {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<HistoryItem['status'] | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'hero' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet item ?')) {
      dispatch({ type: 'DELETE_HISTORY_ITEM', payload: id });
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Voulez-vous vraiment effacer tout l\'historique ?')) {
      dispatch({ type: 'CLEAR_HISTORY' });
      setSelectedItem(null);
    }
  };

  // Filtrage et recherche
  const filteredHistory = state.history.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.productDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: HistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: HistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'processing':
        return 'En cours';
      case 'failed':
        return 'Échec';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Historique</h1>
                <p className="text-sm text-gray-500">
                  {filteredHistory.length} {filteredHistory.length > 1 ? 'traitements' : 'traitement'}
                </p>
              </div>
            </div>

            {state.history.length > 0 && (
              <Button variant="outline" onClick={handleClearAll} className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Tout effacer
              </Button>
            )}
          </div>

          {/* Barre de recherche et filtres */}
          <div className="flex gap-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="all">Tous</option>
                <option value="completed">Terminés</option>
                <option value="processing">En cours</option>
                <option value="failed">Échoués</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredHistory.length === 0 ? (
          <Card className="p-12 text-center">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {state.history.length === 0 ? 'Aucun traitement' : 'Aucun résultat'}
            </h3>
            <p className="text-gray-500">
              {state.history.length === 0
                ? 'Vos traitements d\'images apparaîtront ici'
                : 'Essayez une autre recherche ou modifiez les filtres'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des items */}
            <div className="lg:col-span-2 space-y-4">
              {filteredHistory.map((item) => (
                <Card
                  key={item.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedItem?.id === item.id ? 'ring-2 ring-slate-900' : ''
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.originalImageUrl ? (
                        <img
                          src={item.originalImageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {item.productName}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {item.treatmentDisplayName}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          {getStatusIcon(item.status)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatDate(item.createdAt)}
                        </span>
                        {item.status === 'processing' && (
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{item.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Panneau de détails */}
            <div className="lg:col-span-1">
              {selectedItem ? (
                <Card className="p-6 sticky top-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Détails</h3>

                  <div className="space-y-4">
                    {/* Image originale */}
                    {selectedItem.originalImageUrl && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">
                          Image originale
                        </label>
                        <img
                          src={selectedItem.originalImageUrl}
                          alt={selectedItem.productName}
                          className="w-full rounded-lg"
                        />
                      </div>
                    )}

                    {/* Informations */}
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
                        Produit
                      </label>
                      <p className="text-sm text-gray-900">{selectedItem.productName}</p>
                    </div>

                    {selectedItem.productDescription && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
                          Description
                        </label>
                        <p className="text-sm text-gray-900">{selectedItem.productDescription}</p>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
                        Traitement
                      </label>
                      <p className="text-sm text-gray-900">{selectedItem.treatmentDisplayName}</p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
                        Statut
                      </label>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedItem.status)}
                        <span className="text-sm text-gray-900">{getStatusText(selectedItem.status)}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
                        Date de création
                      </label>
                      <p className="text-sm text-gray-900">{formatDate(selectedItem.createdAt)}</p>
                    </div>

                    {selectedItem.completedAt && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
                          Date de fin
                        </label>
                        <p className="text-sm text-gray-900">{formatDate(selectedItem.completedAt)}</p>
                      </div>
                    )}

                    {selectedItem.error && (
                      <div>
                        <label className="text-xs font-medium text-red-500 uppercase mb-1 block">
                          Erreur
                        </label>
                        <p className="text-sm text-red-600">{selectedItem.error}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-4 space-y-2">
                      {selectedItem.processedImageUrl && (
                        <Button variant="primary" className="w-full" asChild>
                          <a href={selectedItem.processedImageUrl} download>
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="w-full text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(selectedItem.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-6">
                  <p className="text-center text-gray-500">
                    Sélectionnez un traitement pour voir les détails
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
