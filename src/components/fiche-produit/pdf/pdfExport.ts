import jsPDF from 'jspdf';
import type { ProductFormData, GeneratedProduct, GeneratedRecipe, FicheApiResponse } from '../../../types/product';
import { ALLERGENS } from '../../../utils/allergenData';
import { CERTIFICATIONS } from '../../../utils/certificationData';

const A4_W = 210;
const A4_H = 297;
const MARGIN = 15;
const CONTENT_W = A4_W - MARGIN * 2;
const GOLD = '#D4A853';
const DARK = '#1E293B';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function generatePDF(
  formData: ProductFormData,
  editedContent: { product: GeneratedProduct | null; recipe: GeneratedRecipe | null },
  generatedContent: FicheApiResponse | null
) {
  const product = editedContent.product;
  const recipe = editedContent.recipe;
  if (!product || !recipe) return;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  doc.setFont('helvetica');

  let y = MARGIN;

  doc.setFillColor(DARK);
  doc.rect(0, 0, A4_W, 12, 'F');
  doc.setFontSize(7);
  doc.setTextColor(GOLD);
  doc.text(formData.marque, MARGIN, 8);
  doc.setTextColor(255, 255, 255);
  doc.text(formData.referenceInterne || '', A4_W - MARGIN, 8, { align: 'right' });

  y = 20;

  if (formData.photoPreview) {
    try {
      const img = await loadImage(formData.photoPreview);
      const maxH = 50;
      const ratio = img.width / img.height;
      const imgW = Math.min(50, maxH * ratio);
      doc.addImage(formData.photoPreview, 'PNG', A4_W - MARGIN - imgW, y, imgW, imgW / ratio);
    } catch { /* skip */ }
  }

  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(formData.nomProduit, CONTENT_W - 60);
  doc.text(titleLines, MARGIN, y + 6);
  y += titleLines.length * 7 + 4;

  if (formData.gamme) {
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.gamme, MARGIN, y);
    y += 6;
  }

  y += 2;
  doc.setDrawColor(212, 168, 83);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, MARGIN + 30, y);
  y += 5;

  doc.setFillColor(255, 251, 235);
  doc.roundedRect(MARGIN, y, CONTENT_W, 14, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setTextColor(146, 64, 14);
  doc.setFont('helvetica', 'italic');
  const accrLines = doc.splitTextToSize(product.accroche, CONTENT_W - 6);
  doc.text(accrLines, MARGIN + 3, y + 5);
  y += Math.max(14, accrLines.length * 4 + 6);

  y += 3;
  doc.setFontSize(8);
  doc.setTextColor(75, 85, 99);
  doc.setFont('helvetica', 'normal');
  const descLines = doc.splitTextToSize(product.description, CONTENT_W);
  doc.text(descLines, MARGIN, y);
  y += descLines.length * 3.5 + 4;

  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text('ARGUMENTS CLES', MARGIN, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(75, 85, 99);
  product.arguments.forEach((arg, i) => {
    doc.setFillColor(212, 168, 83);
    doc.circle(MARGIN + 2, y - 1, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.text(String(i + 1), MARGIN + 1.2, y);
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(8);
    const argLines = doc.splitTextToSize(arg, CONTENT_W - 10);
    doc.text(argLines, MARGIN + 7, y);
    y += argLines.length * 3.5 + 2;
  });

  if (product.utilisations.length > 0) {
    y += 3;
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text('UTILISATIONS', MARGIN, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(product.utilisations.join('  |  '), MARGIN, y);
    y += 6;
  }

  const selectedAllergens = formData.allergenes.filter((a) => a.selected);
  if (selectedAllergens.length > 0) {
    y += 2;
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text('ALLERGENES', MARGIN, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    let ax = MARGIN;
    selectedAllergens.forEach((a) => {
      const info = ALLERGENS.find((al) => al.id === a.id);
      const label = `${info?.label || a.id}${a.traces ? ' (traces)' : ''}`;
      const tw = doc.getTextWidth(label) + 4;
      if (ax + tw > A4_W - MARGIN) { ax = MARGIN; y += 5; }
      doc.setTextColor(100, 116, 139);
      doc.text(label, ax + 2, y);
      ax += tw + 2;
    });
    y += 6;
  }

  const nv = formData.nutritionValues;
  const hasNutrition = Object.values(nv).some((v) => v !== '');
  if (hasNutrition) {
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text('VALEURS NUTRITIONNELLES POUR 100G', MARGIN, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    const nutritionData = [
      ['Energie', nv.energieKcal ? `${nv.energieKcal} kcal` : ''],
      ['Mat. grasses', nv.matieresGrasses ? `${nv.matieresGrasses}g` : ''],
      ['Glucides', nv.glucides ? `${nv.glucides}g` : ''],
      ['Proteines', nv.proteines ? `${nv.proteines}g` : ''],
      ['Sel', nv.sel ? `${nv.sel}g` : ''],
    ].filter(([, v]) => v);
    const colW = CONTENT_W / nutritionData.length;
    nutritionData.forEach(([label, value], i) => {
      const cx = MARGIN + i * colW + colW / 2;
      doc.setFontSize(6);
      doc.setTextColor(148, 163, 184);
      doc.text(label, cx, y, { align: 'center' });
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.text(value, cx, y + 4, { align: 'center' });
      doc.setFont('helvetica', 'normal');
    });
    y += 10;
  }

  if (formData.certifications.length > 0) {
    let cx = MARGIN;
    formData.certifications.forEach((id) => {
      const info = CERTIFICATIONS.find((c) => c.id === id);
      const label = info?.shortLabel || id;
      const tw = doc.getTextWidth(label) + 5;
      if (cx + tw > A4_W - MARGIN) { cx = MARGIN; y += 5; }
      doc.setFontSize(6);
      doc.setTextColor(100, 116, 139);
      doc.text(label, cx + 2, y);
      cx += tw + 1;
    });
  }

  doc.addPage();
  y = MARGIN;

  if (generatedContent?.recipeImageBase64) {
    try {
      const imgSrc = `data:image/png;base64,${generatedContent.recipeImageBase64}`;
      const img = await loadImage(imgSrc);
      const imgH = 60;
      const imgW = A4_W;
      doc.addImage(imgSrc, 'PNG', 0, 0, imgW, imgH, undefined, 'MEDIUM');
      y = imgH + 5;
    } catch { y = MARGIN; }
  }

  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  const recTitleLines = doc.splitTextToSize(recipe.nom, CONTENT_W);
  doc.text(recTitleLines, MARGIN, y);
  y += recTitleLines.length * 6 + 2;

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'italic');
  const recDescLines = doc.splitTextToSize(recipe.description, CONTENT_W);
  doc.text(recDescLines, MARGIN, y);
  y += recDescLines.length * 3.5 + 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(75, 85, 99);
  const metaLine = `Preparation: ${recipe.tempsPreparation}  |  Cuisson: ${recipe.tempsCuisson}  |  ${recipe.portions} portions`;
  doc.text(metaLine, MARGIN, y);
  y += 6;

  doc.setDrawColor(212, 168, 83);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, A4_W - MARGIN, y);
  y += 5;

  const ingredientColW = 60;
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text('INGREDIENTS', MARGIN, y);
  doc.text('PREPARATION', MARGIN + ingredientColW + 5, y);
  y += 5;

  const ingStartY = y;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  recipe.ingredients.forEach((ing) => {
    doc.setTextColor(ing.isVedette ? 180 : 100, ing.isVedette ? 83 : 116, ing.isVedette ? 9 : 139);
    doc.setFont('helvetica', ing.isVedette ? 'bold' : 'normal');
    const ingLine = `${ing.quantite} ${ing.nom}`;
    const ingLines = doc.splitTextToSize(ingLine, ingredientColW - 5);
    doc.text(ingLines, MARGIN + 2, y);
    y += ingLines.length * 3.2 + 1.5;
  });

  let stepsY = ingStartY;
  const stepsX = MARGIN + ingredientColW + 5;
  const stepsW = CONTENT_W - ingredientColW - 5;

  recipe.etapes.forEach((etape) => {
    doc.setFillColor(212, 168, 83);
    doc.circle(stepsX + 2, stepsY - 1, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5);
    doc.text(String(etape.numero), stepsX + 1.2, stepsY - 0.2);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(etape.titre, stepsX + 6, stepsY);
    stepsY += 3.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    const stepLines = doc.splitTextToSize(etape.description, stepsW - 8);
    doc.text(stepLines, stepsX + 6, stepsY);
    stepsY += stepLines.length * 3 + 3;
  });

  y = Math.max(y, stepsY) + 5;

  if (recipe.motDuChef) {
    if (y > A4_H - 30) { doc.addPage(); y = MARGIN; }
    doc.setFillColor(255, 251, 235);
    const motLines = doc.splitTextToSize(recipe.motDuChef, CONTENT_W - 10);
    const boxH = motLines.length * 3.5 + 10;
    doc.roundedRect(MARGIN, y, CONTENT_W, boxH, 2, 2, 'F');
    doc.setFontSize(7);
    doc.setTextColor(146, 64, 14);
    doc.setFont('helvetica', 'bold');
    doc.text('LE MOT DU CHEF', MARGIN + 4, y + 5);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.text(motLines, MARGIN + 4, y + 10);
  }

  const filename = `${formData.nomProduit.replace(/\s+/g, '_')}_fiche_produit.pdf`;
  doc.save(filename);
}
