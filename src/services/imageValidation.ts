import {
  ImageValidationResult,
  ImageValidationError,
  ImageValidationWarning,
  ImageValidationConfig
} from '../types';

/**
 * Configuration par défaut pour la validation d'images
 */
const DEFAULT_CONFIG: ImageValidationConfig = {
  maxSizeInMB: 10,
  minWidth: 500,
  minHeight: 500,
  maxWidth: 8000,
  maxHeight: 8000,
  allowedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  recommendedAspectRatio: 1 // ratio 1:1 recommandé
};

/**
 * Service de validation d'images avant upload
 */
export class ImageValidationService {
  private config: ImageValidationConfig;

  constructor(config?: Partial<ImageValidationConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Valide un fichier image
   */
  async validateImage(file: File): Promise<ImageValidationResult> {
    const errors: ImageValidationError[] = [];
    const warnings: ImageValidationWarning[] = [];
    const suggestions: string[] = [];

    // 1. Vérification du format
    if (!this.config.allowedFormats.includes(file.type)) {
      errors.push({
        type: 'format',
        message: `Format non supporté. Formats acceptés: ${this.getFormatsDisplay()}`
      });
    }

    // 2. Vérification de la taille
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > this.config.maxSizeInMB) {
      errors.push({
        type: 'size',
        message: `Fichier trop volumineux (${sizeInMB.toFixed(2)} MB)`,
        value: sizeInMB,
        limit: this.config.maxSizeInMB
      });
      suggestions.push(`Compressez votre image à moins de ${this.config.maxSizeInMB} MB`);
    } else if (sizeInMB > this.config.maxSizeInMB * 0.7) {
      warnings.push({
        type: 'size',
        message: `Fichier volumineux (${sizeInMB.toFixed(2)} MB)`,
        value: sizeInMB,
        recommended: this.config.maxSizeInMB * 0.5
      });
      suggestions.push('Considérez compresser votre image pour un traitement plus rapide');
    }

    // 3. Vérification des dimensions
    try {
      const dimensions = await this.getImageDimensions(file);

      if (dimensions.width < this.config.minWidth || dimensions.height < this.config.minHeight) {
        errors.push({
          type: 'dimension',
          message: `Image trop petite (${dimensions.width}x${dimensions.height}px)`,
          value: Math.min(dimensions.width, dimensions.height),
          limit: Math.max(this.config.minWidth, this.config.minHeight)
        });
        suggestions.push(`Utilisez une image d'au moins ${this.config.minWidth}x${this.config.minHeight}px`);
      }

      if (dimensions.width > this.config.maxWidth || dimensions.height > this.config.maxHeight) {
        errors.push({
          type: 'dimension',
          message: `Image trop grande (${dimensions.width}x${dimensions.height}px)`,
          value: Math.max(dimensions.width, dimensions.height),
          limit: Math.min(this.config.maxWidth, this.config.maxHeight)
        });
        suggestions.push(`Redimensionnez votre image à maximum ${this.config.maxWidth}x${this.config.maxHeight}px`);
      }

      // Vérification du ratio d'aspect
      if (this.config.recommendedAspectRatio) {
        const aspectRatio = dimensions.width / dimensions.height;
        const diff = Math.abs(aspectRatio - this.config.recommendedAspectRatio);

        if (diff > 0.5) {
          warnings.push({
            type: 'aspect-ratio',
            message: `Ratio d'aspect non optimal (${aspectRatio.toFixed(2)}:1)`,
            value: aspectRatio,
            recommended: this.config.recommendedAspectRatio
          });
          suggestions.push(`Ratio recommandé: ${this.config.recommendedAspectRatio}:1 pour de meilleurs résultats`);
        }
      }

      // Recommandations de qualité
      if (dimensions.width >= 2000 && dimensions.height >= 2000) {
        suggestions.push('✓ Excellente résolution pour un traitement de qualité');
      } else if (dimensions.width >= 1000 && dimensions.height >= 1000) {
        suggestions.push('✓ Bonne résolution pour le traitement');
      }

    } catch (error) {
      errors.push({
        type: 'quality',
        message: 'Impossible de lire les dimensions de l\'image'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Valide plusieurs fichiers
   */
  async validateImages(files: File[]): Promise<Map<string, ImageValidationResult>> {
    const results = new Map<string, ImageValidationResult>();

    for (const file of files) {
      const result = await this.validateImage(file);
      results.set(file.name, result);
    }

    return results;
  }

  /**
   * Obtient les dimensions d'une image
   */
  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Impossible de charger l\'image'));
      };

      img.src = url;
    });
  }

  /**
   * Affichage lisible des formats acceptés
   */
  private getFormatsDisplay(): string {
    return this.config.allowedFormats
      .map(format => format.replace('image/', '').toUpperCase())
      .join(', ');
  }

  /**
   * Vérifie rapidement si un fichier est une image
   */
  static isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Obtient les métadonnées d'une image
   */
  async getImageMetadata(file: File) {
    const dimensions = await this.getImageDimensions(file);

    return {
      name: file.name,
      size: file.size,
      sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
      type: file.type,
      format: file.type.replace('image/', '').toUpperCase(),
      dimensions,
      aspectRatio: (dimensions.width / dimensions.height).toFixed(2),
      lastModified: new Date(file.lastModified)
    };
  }

  /**
   * Compresse une image si elle dépasse la taille maximale
   */
  async compressIfNeeded(file: File, maxSizeInMB: number = 5): Promise<File> {
    const sizeInMB = file.size / (1024 * 1024);

    if (sizeInMB <= maxSizeInMB) {
      return file; // Pas besoin de compression
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Canvas non supporté'));
            return;
          }

          // Calcul de la réduction nécessaire
          const ratio = Math.sqrt(maxSizeInMB / sizeInMB);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Échec de la compression'));
                return;
              }

              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });

              console.log(`✅ Image compressée: ${sizeInMB.toFixed(2)}MB → ${(compressedFile.size / (1024 * 1024)).toFixed(2)}MB`);
              resolve(compressedFile);
            },
            file.type,
            0.85 // Qualité 85%
          );
        };

        img.onerror = () => reject(new Error('Échec du chargement de l\'image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Échec de la lecture du fichier'));
      reader.readAsDataURL(file);
    });
  }
}

export const imageValidator = new ImageValidationService();
