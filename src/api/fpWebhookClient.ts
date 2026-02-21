import type { ProductFormData, FicheApiResponse } from '../types/product';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function generateFicheProduit(
  webhookUrl: string,
  formData: ProductFormData
): Promise<FicheApiResponse> {
  if (!webhookUrl) {
    throw new Error('URL du webhook non configuree. Allez dans les parametres pour la definir.');
  }

  let photoBase64 = '';
  if (formData.photoFile) {
    photoBase64 = await fileToBase64(formData.photoFile);
  }

  const selectedAllergens = formData.allergenes
    .filter((a) => a.selected)
    .map((a) => ({
      id: a.id,
      traces: a.traces,
    }));

  const payload = {
    marque: formData.marque,
    nomProduit: formData.nomProduit,
    referenceInterne: formData.referenceInterne,
    codeEAN: formData.codeEAN,
    gamme: formData.gamme,
    photoBase64,
    photoMimeType: formData.photoFile?.type || '',
    poidsNet: formData.poidsNet,
    conditionnement: formData.conditionnement,
    ingredients: formData.ingredients,
    allergenes: selectedAllergens,
    nutritionValues: formData.nutritionValues,
    dlcDluo: formData.dlcDluo,
    conservation: formData.conservation,
    origine: formData.origine,
    certifications: formData.certifications,
    descriptionLibre: formData.descriptionLibre,
    styleRecette: formData.styleRecette,
    difficulte: formData.difficulte,
    portions: formData.portions,
    notesRecette: formData.notesRecette,
    formatProfessionnel: formData.formatProfessionnel,
    timestamp: new Date().toISOString(),
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `Erreur serveur (${response.status})`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'La generation a echoue');
  }

  return data as FicheApiResponse;
}
