import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface BudgetRecommendation {
  minBudget: string;
  optimalBudget: string;
  budgetDistribution?: Array<{
    platform: string;
    percentage: string;
    rationale: string;
  }>;
  expectedResults?: string;
}

interface AdType {
  type: string;
  description: string;
  bestFor: string;
}

interface BlogPost {
  title: string;
  summary: string;
  keywords?: string[];
}

interface SocialMediaPost {
  platform: string;
  contentIdeas: string[];
}

interface OrganicContent {
  blogPosts?: BlogPost[];
  socialMediaPosts?: SocialMediaPost[];
}

interface AnalysisResult {
  service: string;
  sector?: string;
  budgetRecommendation?: BudgetRecommendation;
  adTypes?: AdType[];
  organicContent?: OrganicContent;
}

export function generatePDF(result: AnalysisResult) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header - AdGusto Logo and Title
  doc.setFillColor(254, 222, 0); // #FEDE00
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(33, 33, 33);
  doc.text('AdGusto', 15, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Pazarlama Analiz Raporu', 15, 28);

  yPosition = 45;

  // Service Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(33, 33, 33);
  doc.text('Hizmet/Ürün:', 15, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(result.service, 50, yPosition);

  yPosition += 10;

  if (result.sector) {
    doc.setFont('helvetica', 'bold');
    doc.text('Sektör:', 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(result.sector, 50, yPosition);
    yPosition += 15;
  } else {
    yPosition += 10;
  }

  // Budget Recommendation
  if (result.budgetRecommendation) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 33, 33);
    doc.text('Bütçe Önerisi', 15, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const budgetData = [
      ['Minimum Bütçe', `${result.budgetRecommendation.minBudget} TL`],
      ['Optimal Bütçe', `${result.budgetRecommendation.optimalBudget} TL`]
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [['Bütçe Tipi', 'Tutar']],
      body: budgetData,
      theme: 'grid',
      headStyles: {
        fillColor: [254, 222, 0],
        textColor: [33, 33, 33],
        fontStyle: 'bold'
      },
      margin: { left: 15, right: 15 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    // Budget Distribution
    if (result.budgetRecommendation.budgetDistribution && result.budgetRecommendation.budgetDistribution.length > 0) {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Platform Dağılımı:', 15, yPosition);
      yPosition += 8;

      const distributionData = result.budgetRecommendation.budgetDistribution.map(dist => [
        dist.platform,
        `${dist.percentage}%`,
        dist.rationale
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Platform', 'Oran', 'Açıklama']],
        body: distributionData,
        theme: 'grid',
        headStyles: {
          fillColor: [254, 222, 0],
          textColor: [33, 33, 33],
          fontStyle: 'bold'
        },
        margin: { left: 15, right: 15 },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 20 },
          2: { cellWidth: 'auto' }
        }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 5;

      if (result.budgetRecommendation.expectedResults) {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        const splitText = doc.splitTextToSize(result.budgetRecommendation.expectedResults, pageWidth - 30);
        doc.text(splitText, 15, yPosition);
        yPosition += splitText.length * 5 + 10;
      }
    }
  }

  // Ad Types
  if (result.adTypes && result.adTypes.length > 0) {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 33, 33);
    doc.text('Önerilen Reklam Formatları', 15, yPosition);
    yPosition += 8;

    const adTypeData = result.adTypes.map(ad => [
      ad.type,
      ad.description,
      ad.bestFor
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Format', 'Açıklama', 'En İyi Kullanım']],
      body: adTypeData,
      theme: 'grid',
      headStyles: {
        fillColor: [254, 222, 0],
        textColor: [33, 33, 33],
        fontStyle: 'bold'
      },
      margin: { left: 15, right: 15 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Organic Content
  if (result.organicContent) {
    // Blog Posts
    if (result.organicContent.blogPosts && result.organicContent.blogPosts.length > 0) {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Blog Yazısı Önerileri', 15, yPosition);
      yPosition += 8;

      const blogData = result.organicContent.blogPosts.map(post => [
        post.title,
        post.summary,
        post.keywords ? post.keywords.join(', ') : ''
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Başlık', 'Özet', 'Anahtar Kelimeler']],
        body: blogData,
        theme: 'grid',
        headStyles: {
          fillColor: [254, 222, 0],
          textColor: [33, 33, 33],
          fontStyle: 'bold'
        },
        margin: { left: 15, right: 15 }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }

    // Social Media Posts
    if (result.organicContent.socialMediaPosts && result.organicContent.socialMediaPosts.length > 0) {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Sosyal Medya İçerik Önerileri', 15, yPosition);
      yPosition += 8;

      result.organicContent.socialMediaPosts.forEach((post, index) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${post.platform}:`, 15, yPosition);
        yPosition += 6;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        post.contentIdeas.forEach((idea, idx) => {
          if (yPosition > pageHeight - 20) {
            doc.addPage();
            yPosition = 20;
          }
          const splitIdea = doc.splitTextToSize(`• ${idea}`, pageWidth - 35);
          doc.text(splitIdea, 20, yPosition);
          yPosition += splitIdea.length * 4.5;
        });

        yPosition += 5;
      });
    }
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text(
      `AdGusto © ${new Date().getFullYear()} - Sayfa ${i}/${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  const fileName = `AdGusto_Analiz_${result.service.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.pdf`;
  doc.save(fileName);
}
