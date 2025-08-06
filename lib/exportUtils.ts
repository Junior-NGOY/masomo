import * as XLSX from 'xlsx';

export interface ExportColumn {
  key: string;
  label: string;
  width?: number;
  type?: 'text' | 'number' | 'currency' | 'date' | 'percentage';
}

export interface ExportOptions {
  filename: string;
  sheetName: string;
  title?: string;
  subtitle?: string;
  columns: ExportColumn[];
  data: any[];
  includeTimestamp?: boolean;
}

export class ExportService {
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static formatDate(dateString: string): string {
    if (!dateString || dateString === 'Non payé') return dateString;
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  static formatValue(value: any, type: string): string {
    if (value === null || value === undefined) return '';
    
    switch (type) {
      case 'currency':
        return typeof value === 'number' ? this.formatCurrency(value) : value.toString();
      case 'date':
        return this.formatDate(value.toString());
      case 'percentage':
        return typeof value === 'number' ? `${value.toFixed(1)}%` : value.toString();
      case 'number':
        return typeof value === 'number' ? value.toLocaleString('fr-FR') : value.toString();
      default:
        return value.toString();
    }
  }

  static exportToExcel(options: ExportOptions): void {
    const {
      filename,
      sheetName,
      title,
      subtitle,
      columns,
      data,
      includeTimestamp = true
    } = options;

    // Créer un nouveau workbook
    const workbook = XLSX.utils.book_new();
    
    // Préparer les données pour l'export
    const exportData: any[][] = [];
    
    // Ajouter le titre si fourni
    if (title) {
      exportData.push([title]);
      exportData.push([]); // Ligne vide
    }
    
    // Ajouter le sous-titre si fourni
    if (subtitle) {
      exportData.push([subtitle]);
      exportData.push([]); // Ligne vide
    }

    // Ajouter la date et l'heure d'export si demandé
    if (includeTimestamp) {
      const now = new Date();
      exportData.push([`Exporté le ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}`]);
      exportData.push([]); // Ligne vide
    }

    // Index de la ligne des en-têtes
    const headerRowIndex = exportData.length;
    
    // Ajouter les en-têtes
    exportData.push(columns.map(col => col.label));
    
    // Ajouter les données
    data.forEach(row => {
      const exportRow = columns.map(col => {
        const value = row[col.key];
        return this.formatValue(value, col.type || 'text');
      });
      exportData.push(exportRow);
    });

    // Créer la feuille de calcul
    const worksheet = XLSX.utils.aoa_to_sheet(exportData);

    // Définir les largeurs des colonnes
    const colWidths = columns.map(col => ({ 
      wch: col.width || Math.max(col.label.length + 5, 15) 
    }));
    worksheet['!cols'] = colWidths;

    // Fusionner les cellules pour le titre
    if (title) {
      const titleRange = XLSX.utils.encode_range({
        s: { c: 0, r: 0 },
        e: { c: columns.length - 1, r: 0 }
      });
      if (!worksheet['!merges']) worksheet['!merges'] = [];
      worksheet['!merges'].push(XLSX.utils.decode_range(titleRange));
    }

    // Fusionner les cellules pour le sous-titre
    if (subtitle) {
      const subtitleRowIndex = title ? 2 : 0;
      const subtitleRange = XLSX.utils.encode_range({
        s: { c: 0, r: subtitleRowIndex },
        e: { c: columns.length - 1, r: subtitleRowIndex }
      });
      if (!worksheet['!merges']) worksheet['!merges'] = [];
      worksheet['!merges'].push(XLSX.utils.decode_range(subtitleRange));
    }

    // Ajouter des styles basiques (les styles avancés nécessitent xlsx-style)
    // Créer un objet de styles pour les en-têtes
    const headerRow = headerRowIndex + 1; // +1 car Excel utilise une indexation basée sur 1
    
    for (let i = 0; i < columns.length; i++) {
      const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: i });
      if (worksheet[cellAddress]) {
        // Définir le style de base pour les en-têtes
        worksheet[cellAddress].s = {
          font: { bold: true, sz: 12 },
          fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "EEEEEE" } },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }
    }

    // Ajouter la feuille au workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Générer et télécharger le fichier
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0];
    const finalFilename = `${filename}_${timestamp}.xlsx`;
    
    XLSX.writeFile(workbook, finalFilename);
  }

  // Méthode spécialisée pour exporter les frais scolaires
  static exportStudentFees(fees: any[], options?: Partial<ExportOptions>): void {
    const columns: ExportColumn[] = [
      { key: 'studentName', label: 'Nom de l\'élève', width: 25 },
      { key: 'className', label: 'Classe', width: 15 },
      { key: 'feeType', label: 'Type de frais', width: 20 },
      { key: 'amount', label: 'Montant', width: 15, type: 'currency' },
      { key: 'dueDate', label: 'Date d\'échéance', width: 15, type: 'date' },
      { key: 'paidDate', label: 'Date de paiement', width: 15, type: 'date' },
      { key: 'status', label: 'Statut', width: 12 },
      { key: 'paymentMethod', label: 'Méthode de paiement', width: 18 },
      { key: 'receiptNo', label: 'N° de reçu', width: 15 },
      { key: 'remainingAmount', label: 'Montant restant', width: 15, type: 'currency' },
      { key: 'notes', label: 'Notes', width: 30 }
    ];

    // Transformer les données pour l'export
    const exportData = fees.map(fee => ({
      studentName: fee.studentName,
      className: fee.className,
      feeType: fee.feeType,
      amount: fee.amount,
      dueDate: fee.dueDate,
      paidDate: fee.paidDate || 'Non payé',
      status: fee.status === 'PAID' ? 'Payé' : 
              fee.status === 'PENDING' ? 'En attente' :
              fee.status === 'OVERDUE' ? 'En retard' : 'Partiel',
      paymentMethod: fee.paymentMethod || 'N/A',
      receiptNo: fee.receiptNo || 'N/A',
      remainingAmount: fee.remainingAmount || 0,
      notes: fee.notes || ''
    }));

    const defaultOptions: ExportOptions = {
      filename: 'frais_scolaires',
      sheetName: 'Frais Scolaires',
      title: 'RAPPORT DES FRAIS SCOLAIRES',
      subtitle: `École Masomo Pro - ${exportData.length} frais enregistrés`,
      columns,
      data: exportData,
      includeTimestamp: true
    };

    this.exportToExcel({ ...defaultOptions, ...options });
  }

  // Méthode spécialisée pour exporter les élèves avec leurs frais
  static exportStudentProfiles(students: any[], options?: Partial<ExportOptions>): void {
    const columns: ExportColumn[] = [
      { key: 'name', label: 'Nom de l\'élève', width: 25 },
      { key: 'className', label: 'Classe', width: 15 },
      { key: 'email', label: 'Email', width: 25 },
      { key: 'totalFees', label: 'Total des frais', width: 15, type: 'currency' },
      { key: 'paidFees', label: 'Frais payés', width: 15, type: 'currency' },
      { key: 'pendingFees', label: 'Frais en attente', width: 15, type: 'currency' },
      { key: 'paymentPercentage', label: 'Progression', width: 12, type: 'percentage' },
      { key: 'paymentStatus', label: 'Statut des paiements', width: 18 }
    ];

    // Transformer les données pour l'export
    const exportData = students.map(student => ({
      name: student.name,
      className: student.className,
      email: student.email,
      totalFees: student.totalFees,
      paidFees: student.paidFees,
      pendingFees: student.pendingFees,
      paymentPercentage: Math.round((student.paidFees / student.totalFees) * 100),
      paymentStatus: student.pendingFees === 0 ? 'Frais payés' :
                    student.paidFees === 0 ? 'Frais en attente' : 'Paiement partiel'
    }));

    const defaultOptions: ExportOptions = {
      filename: 'eleves_frais',
      sheetName: 'Élèves et Frais',
      title: 'RAPPORT DES ÉLÈVES ET LEURS FRAIS',
      subtitle: `École Masomo Pro - ${exportData.length} élèves`,
      columns,
      data: exportData,
      includeTimestamp: true
    };

    this.exportToExcel({ ...defaultOptions, ...options });
  }
}
