import { DetailedItinerary } from './agentic-itinerary';

export class SimpleFileGenerator {
  
  // Generate a comprehensive text-based itinerary
  generateTextItinerary(itinerary: DetailedItinerary): string {
    let content = `
${itinerary.title.toUpperCase()}
${'='.repeat(itinerary.title.length)}

${itinerary.overview}

TRIP SUMMARY
============
Total Budget: ${itinerary.currency} ${itinerary.totalCost.toLocaleString()}
Duration: ${itinerary.days.length} days
Cities: ${[...new Set(itinerary.days.map(day => day.city))].join(', ')}

DAILY ITINERARY
===============
`;

    itinerary.days.forEach((day, index) => {
      content += `
DAY ${day.day}: ${day.theme.toUpperCase()}
${'-'.repeat(30)}
Date: ${day.date}
City: ${day.city}
Estimated Cost: ${itinerary.currency} ${day.estimatedCost.toLocaleString()}

ACTIVITIES:
`;

      day.activities.forEach(activity => {
        content += `
${activity.time} - ${activity.title}
   Duration: ${activity.duration}
   Cost: ${itinerary.currency} ${activity.cost.toLocaleString()}
   Location: ${activity.location}
   Description: ${activity.description}
`;
      });

      content += `
MEALS:
`;
      day.meals.forEach(meal => {
        content += `
${meal.time} - ${meal.type.toUpperCase()} at ${meal.restaurant}
   Cuisine: ${meal.cuisine}
   Cost: ${itinerary.currency} ${meal.cost.toLocaleString()}
   Location: ${meal.location}
`;
      });

      if (day.accommodation) {
        content += `
ACCOMMODATION:
${day.accommodation.name} (${day.accommodation.type})
   Location: ${day.accommodation.location}
   Rating: ${day.accommodation.rating}/5
   Price per night: ${itinerary.currency} ${day.accommodation.pricePerNight.toLocaleString()}
   Amenities: ${day.accommodation.amenities.join(', ')}
`;
      }

      if (day.tips && day.tips.length > 0) {
        content += `
TIPS FOR THE DAY:
${day.tips.map(tip => `• ${tip}`).join('\n')}
`;
      }

      content += '\n' + '='.repeat(50) + '\n';
    });

    // Add budget breakdown
    content += `
BUDGET BREAKDOWN
================
`;

    Object.entries(itinerary.budgetBreakdown.categories).forEach(([category, data]) => {
      content += `
${category.toUpperCase()}:
   Budgeted: ${itinerary.currency} ${data.budgeted.toLocaleString()}
   Estimated: ${itinerary.currency} ${data.estimated.toLocaleString()}
   Percentage: ${data.percentage}%
`;
    });

    // Add recommendations
    if (itinerary.recommendations) {
      content += `
RECOMMENDATIONS
===============

HIDDEN GEMS:
${itinerary.recommendations.hiddenGems?.map(gem => `• ${gem.name}: ${gem.description}`).join('\n') || 'None specified'}

FOOD RECOMMENDATIONS:
${itinerary.recommendations.foodRecommendations?.map(food => `• ${food.dish}: ${food.description}`).join('\n') || 'None specified'}

SAFETY TIPS:
${itinerary.recommendations.safetyTips?.map(tip => `• ${tip}`).join('\n') || 'None specified'}

CULTURAL ETIQUETTE:
${itinerary.recommendations.culturalEtiquette?.map(tip => `• ${tip}`).join('\n') || 'None specified'}
`;
    }

    // Add emergency information
    if (itinerary.emergencyInfo) {
      content += `
EMERGENCY INFORMATION
=====================

EMERGENCY NUMBERS:
${itinerary.emergencyInfo.emergencyNumbers?.map(contact => `${contact.service}: ${contact.number}`).join('\n') || 'Not specified'}

TOURIST HELPLINE: ${itinerary.emergencyInfo.tourist_helpline || 'Not specified'}
`;
    }

    return content;
  }

  // Generate CSV budget breakdown
  generateCSVBudget(itinerary: DetailedItinerary): string {
    let csv = 'Category,Budgeted,Estimated,Percentage\n';
    
    Object.entries(itinerary.budgetBreakdown.categories).forEach(([category, data]) => {
      csv += `${category},${data.budgeted},${data.estimated},${data.percentage}%\n`;
    });

    csv += '\n\nDaily Breakdown\n';
    csv += 'Day,Date,City,Total Cost,Accommodation,Food,Transport,Activities\n';

    itinerary.days.forEach(day => {
      const accommodationCost = day.accommodation?.totalCost || 0;
      const foodCost = day.meals.reduce((sum, meal) => sum + meal.cost, 0);
      const transportCost = day.transport.reduce((sum, transport) => sum + transport.cost, 0);
      const activityCost = day.activities.reduce((sum, activity) => sum + activity.cost, 0);

      csv += `${day.day},${day.date},${day.city},${day.estimatedCost},${accommodationCost},${foodCost},${transportCost},${activityCost}\n`;
    });

    return csv;
  }

  // Generate JSON backup
  generateJSONBackup(itinerary: DetailedItinerary): string {
    return JSON.stringify(itinerary, null, 2);
  }

  // Download helpers
  downloadTextFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    this.downloadBlob(blob, filename);
  }

  downloadCSVFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv' });
    this.downloadBlob(blob, filename);
  }

  downloadJSONFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'application/json' });
    this.downloadBlob(blob, filename);
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Download all files
  downloadAllFiles(itinerary: DetailedItinerary): void {
    const timestamp = new Date().toISOString().split('T')[0];
    const destination = itinerary.title.replace(/[^a-zA-Z0-9]/g, '_');

    // Generate content
    const textContent = this.generateTextItinerary(itinerary);
    const csvContent = this.generateCSVBudget(itinerary);
    const jsonContent = this.generateJSONBackup(itinerary);

    // Download files
    this.downloadTextFile(textContent, `${destination}_Itinerary_${timestamp}.txt`);
    this.downloadCSVFile(csvContent, `${destination}_Budget_${timestamp}.csv`);
    this.downloadJSONFile(jsonContent, `${destination}_Backup_${timestamp}.json`);

    console.log('✅ All files downloaded successfully!');
  }
}

export const simpleFileGenerator = new SimpleFileGenerator();
